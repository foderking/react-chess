import assert from "assert"
import { generateMoves, Move } from "./movegen"
import * as Util from "./util"
import { AllPieces } from "./util"

export const defaultFenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
const digitRegex = /\d+/


/**
 * Represent the board state
 */
export class BoardState {
    /** Side to play next */
    public current_side: Util.Family
    /** Last 4bits reps the castling rights in the board */
    public castling    : number
    /** Last enpassant square (NULL_POSITION if none) */
    public enpassant_sq: Util.BoardPosition
    /** The board where pieces are located*/
    public board       : Util.MailBox88
    /** Number of halfmoves since last pawn move or capture */
    public half_move   : number
    /** Number of full moves in the game */
    public full_move   : number
    /** Dictionary of all valid moves in the board indexed by the location of the piece making them */
    public _moveList : Util.MoveDictionary
    /** All the pieces that have been killed during the game */
    public _killed   : Array<string>
    /** An array of past moves made */
    public _pastMoves: Array<Move>

    static fen_regex = /^((?:[prbnkqPRBNKQ1-8]{1,8}\/){7}[prbnkqPRBNKQ1-8]{1,8}) ([wb]) (-|K?Q?k?q?) (-|[a-f][1-8]) (\d{1,2}|100) (\d+)$/g

    private static parsePiece(_board: string): Util.MailBox88 {
        let board = new Array<AllPieces>(128) as Util.MailBox88
        let next_pos = 0x10
        let current_pos = Util.BoardPosition.A1

        for (let row of _board.split("/").reverse()) {
            let check = 0 // checks that theres exactlly 8 positions in each row
            for (let pos of row) {
                if (pos.match(digitRegex)) {
                    let num = parseInt(pos)
                    for (let i=0; i<num; i++ )
                        board[current_pos++] = AllPieces.NULL
                    check += num
                    continue
                }
                
                switch (pos) {
                    case 'p':
                        board[current_pos++] = AllPieces.BlackPawn  ; break;
                    case 'r':
                        board[current_pos++] = AllPieces.BlackRook  ; break;
                    case 'b':
                        board[current_pos++] = AllPieces.BlackBishop; break;
                    case 'n':
                        board[current_pos++] = AllPieces.BlackKnight; break;
                    case 'q':
                        board[current_pos++] = AllPieces.BlackQueen ; break;
                    case 'k':
                        board[current_pos++] = AllPieces.BlackKing  ; break;
                    case 'P':
                        board[current_pos++] = AllPieces.WhitePawn  ; break;
                    case 'R':
                        board[current_pos++] = AllPieces.WhiteRook  ; break;
                    case 'B':
                        board[current_pos++] = AllPieces.WhiteBishop; break;
                    case 'N':
                        board[current_pos++] = AllPieces.WhiteKnight; break;
                    case 'Q':
                        board[current_pos++] = AllPieces.WhiteQueen ; break;
                    case 'K':
                        board[current_pos++] = AllPieces.WhiteKing  ; break;
                    default:
                        throw new Util.NotExpectedError()
                }
                check++
            }
            Util.checkCondition(check===8)
            current_pos = next_pos
            next_pos += 16 // skips the dummy board
        }
        return board
    }

    private static parseSideToMove(_side2move: string): Util.Family {
        switch(_side2move) {
            case "w":
                return Util.Family.White
            case "b":
                return Util.Family.Black
            default:
                throw new Util.NotExpectedError()
        }
    }

    private static parseCastling(_castling: string): Util.CastleType {
        let castling = Util.CastleType.NoCastling
        if (_castling !== "-")
            for (let ch of _castling) {
                switch (ch) {
                    case 'K':
                        castling |= Util.CastleType.WKingCastle
                        break;
                    case 'Q':
                        castling |= Util.CastleType.WQueenCastle
                        break;
                    case 'q':
                        castling |= Util.CastleType.BQueenCastle
                        break;
                    case 'k':
                        castling |= Util.CastleType.BKingCastle
                        break;
                    default:
                        throw new Util.NotExpectedError()
                }
            }
        return castling
    }

    constructor(fen_string = defaultFenString) {
        let match = fen_string.matchAll(BoardState.fen_regex).next().value
        let _board: string     = match[1]
        let _side2move: string = match[2]
        let _castling: string  = match[3]
        let _enpassant: string = match[4]
        let _halfmove: string  = match[5]
        let _fullmove: string  = match[6]

        // parse pieces
        this.board        = BoardState.parsePiece(_board)
        // parse side to move
        this.current_side = BoardState.parseSideToMove(_side2move)
        // parse castling
        this.castling     = BoardState.parseCastling(_castling)
        // parse enpassant square
        if (_enpassant==="-")
            this.enpassant_sq = Util.BoardPosition.NULL
        else
            this.enpassant_sq = Util.parsePosition(_enpassant[0], _enpassant[1])
        // parse halfmove
        this.half_move = parseInt(_halfmove)
        // parse fullmove
        this.full_move = parseInt(_fullmove)

        this._moveList = this.genMoves()
        this._killed   = []
        this._pastMoves= []
    }

    private  genMoves(): Util.MoveDictionary {
        let dict: Util.BoardDictionary<Move[]> = {}
        for (let pos of Util.serializeBoardPosition()) {
            let index = Util.parsePosition(pos[0], pos[1])
            let pieceAtIndex = this.board[index]
            dict[index]  = generateMoves(this, pieceAtIndex, index)
        }
        return dict as Util.MoveDictionary
    }

    /** Determines if a given move can reset the halfmove clock
     *  only captures and pawn moves can do that
     */
    private canResetHalfMove(move: Move): boolean {
        return move.capturedPiece!==AllPieces.NULL || Util.getPiece(move.movingPiece)===Util.MainPieces.Pawn
    }

    private getNewBoard(move: Move): Util.MailBox88 {
        let new_board  =this.board.concat() as Util.MailBox88
        new_board[move.to]   = move.movingPiece
        new_board[move.from] = AllPieces.NULL

        if (move.promotion !== undefined) {
            Util.checkCondition(Util.getPiece(new_board[move.to])===Util.MainPieces.Pawn)
            Util.checkCondition(Util.getPieceColor(new_board[move.to])===this.current_side)

            switch (move.promotion) {
                case Util.PromotionTypes.Queen:
                    new_board[move.to] = Util.getAllPiece(Util.MainPieces.Queen, this.current_side)
                    break;
                case Util.PromotionTypes.Knight:
                    new_board[move.to] = Util.getAllPiece(Util.MainPieces.Knight, this.current_side)
                    break;
                case Util.PromotionTypes.Bishop:
                    new_board[move.to] = Util.getAllPiece(Util.MainPieces.Bishop, this.current_side)
                    break;
                case Util.PromotionTypes.Rook:
                    new_board[move.to] = Util.getAllPiece(Util.MainPieces.Rook, this.current_side)
                    break;
                default:
                    throw new Util.NotExpectedError()
            }
        }
        return new_board
    }

    private getNewKilledPieces(move: Move): string[] {
        let killed      = this._killed.concat()
        if (move.capturedPiece!==AllPieces.NULL) killed.push(Util.serializePiece(move.capturedPiece))
        return killed
    }

    private getNewFullMove(): number {
        return this.full_move + Number(this.current_side===Util.Family.Black)
    }

    private getNewHalfMove(move: Move): number {
        return this.canResetHalfMove(move) ? 0 : (this.half_move + 1)
    }

    /** Returns a new board with the specified move made on it */
    public make_move(move: Move): BoardState {
        if (move.castling || move.enPassant) throw new Error("Not implemented");
        if (move.movingPiece!==this.board[move.from]) {console.log(move); throw new Error("Corrupted move")}

        let new_board = new BoardState()

        new_board.castling     = this.castling //TODO
        new_board.enpassant_sq = this.enpassant_sq //TODO
        new_board.full_move    = this.getNewFullMove()
        new_board.board        = this.getNewBoard(move)
        new_board._killed      = this.getNewKilledPieces(move)
        new_board.current_side = Util.getOppositeFamily(this.current_side)
        new_board.half_move    = this.getNewHalfMove(move)
        new_board._pastMoves   = this._pastMoves.concat(move)

        new_board._moveList    = new_board.genMoves()

        return new_board
    }

    /** Checks if a piece at a position is able to make a move */
    public isValidPiece(pos: Util.BoardPosition) {
        return this.board[pos]!==AllPieces.NULL && Util.getPieceColor(this.board[pos])===this.current_side
    }

    /** Checks if a pawn at `square` can make a double push */
    public canDoublePush(square: Util.BoardPosition): boolean {
        Util.checkCondition(Util.getPiece(this.board[square])===Util.MainPieces.Pawn)

        if (Util.getPieceColor(this.board[square])===Util.Family.Black) return Util.getRank(square)===Util.Ranks.RANK_7
        else return Util.getRank(square)===Util.Ranks.RANK_2
    }

}