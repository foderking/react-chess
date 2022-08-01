import assert from "assert"
import { generateBishopMove, generateMoves } from "./movegen"
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

    public _moveList: Util.MoveDictionary

    static fen_regex = /^((?:[prbnkqPRBNKQ1-8]{1,8}\/){7}[prbnkqPRBNKQ1-8]{1,8}) ([wb]) (-|K?Q?k?q?) (-|[a-f][1-8]) (\d{1,2}|100) (\d+)$/g

    private parsePiece(_board: string) {
        this.board = new Array<AllPieces>(128) as Util.MailBox88
        let next = 0x10
        let current_pos = Util.BoardPosition.A1
        for (let row of _board.split("/").reverse()) {
            let check = 0 // checks that theres exactlly 8 positions in each row
            for (let pos of row) {
                if (pos.match(digitRegex)) {
                    let num = parseInt(pos)
                    for (let i=0; i<num; i++ ) {
                        //console.log(current_pos.toString(2).padStart(8, "0"))
                        this.board[current_pos++] = AllPieces.NULL
                        check++
                    }
                    continue
                }
                //console.log(current_pos.toString(2).padStart(8, "0"))
                switch (pos) {
                    case 'p':
                        this.board[current_pos++] = AllPieces.BlackPawn  ; break;
                    case 'r':
                        this.board[current_pos++] = AllPieces.BlackRook  ; break;
                    case 'b':
                        this.board[current_pos++] = AllPieces.BlackBishop; break;
                    case 'n':
                        this.board[current_pos++] = AllPieces.BlackKnight; break;
                    case 'q':
                        this.board[current_pos++] = AllPieces.BlackQueen ; break;
                    case 'k':
                        this.board[current_pos++] = AllPieces.BlackKing  ; break;
                    case 'P':
                        this.board[current_pos++] = AllPieces.WhitePawn  ; break;
                    case 'R':
                        this.board[current_pos++] = AllPieces.WhiteRook  ; break;
                    case 'B':
                        this.board[current_pos++] = AllPieces.WhiteBishop; break;
                    case 'N':
                        this.board[current_pos++] = AllPieces.WhiteKnight; break;
                    case 'Q':
                        this.board[current_pos++] = AllPieces.WhiteQueen ; break;
                    case 'K':
                        this.board[current_pos++] = AllPieces.WhiteKing  ; break;
                    default:
                        throw new Error("Invalid board");
                }
                check++
            }
            assert(check===8, "Invalid Piece")
            current_pos = next
            next += 16 // skips the dummy board
        }
    }

    private parseSideToMove(_side2move: string) {
        switch(_side2move) {
            case "w":
                this.current_side = Util.Family.White
                break;
            case "b":
                this.current_side = Util.Family.Black
                break
            default:
                throw new Error("Invalid fen string");
        }
    }

    private parseCastling(_castling: string) {
        this.castling = Util.CastleType.NoCastling
        if (_castling !== "-")
            for (let ch of _castling) {
                switch (ch) {
                    case 'K':
                        this.castling |= Util.CastleType.WKingCastle
                        break;
                    case 'Q':
                        this.castling |= Util.CastleType.WQueenCastle
                        break;
                    case 'q':
                        this.castling |= Util.CastleType.BQueenCastle
                        break;
                    case 'k':
                        this.castling |= Util.CastleType.BKingCastle
                        break;
                    default:
                        throw new Error("Invalid fen string");
                }
            }
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
        this.parsePiece(_board)
        // parse side to move
        this.parseSideToMove(_side2move)
        // parse castling
        this.parseCastling(_castling)
        // parse enpassant square
        if (_enpassant==="-") this.enpassant_sq = Util.BoardPosition.NULL
        else this.enpassant_sq = Util.parsePosition(_enpassant[0], _enpassant[1])
        // parse halfmove
        this.half_move = parseInt(_halfmove)
        // parse fullmove
        this.full_move = parseInt(_fullmove)

        this._moveList = this.genMoves()

        /*
            this.castling     = Util.CastleType.NoCastling
                                | Util.CastleType.BKingCastle
                                | Util.CastleType.BQueenCastle
                                | Util.CastleType.WKingCastle
                                | Util.CastleType.WQueenCastle
            this.board = [
                AllPieces.BlackRook  , AllPieces.BlackKnight, AllPieces.BlackBishop, AllPieces.BlackQueen , AllPieces.BlackKing  , AllPieces.BlackBishop, AllPieces.BlackKnight, AllPieces.BlackRook  , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
                AllPieces.BlackPawn  , AllPieces.BlackPawn  , AllPieces.BlackPawn  , AllPieces.BlackPawn  , AllPieces.BlackPawn  , AllPieces.BlackPawn  , AllPieces.BlackPawn  , AllPieces.BlackPawn  , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
                AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
                AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
                AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
                AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
                AllPieces.WhitePawn  , AllPieces.WhitePawn  , AllPieces.WhitePawn  , AllPieces.WhitePawn  , AllPieces.WhitePawn  , AllPieces.WhitePawn  , AllPieces.WhitePawn  , AllPieces.WhitePawn  , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
                AllPieces.WhiteRook  , AllPieces.WhiteKnight, AllPieces.WhiteBishop, AllPieces.WhiteQueen , AllPieces.WhiteKing  , AllPieces.WhiteBishop, AllPieces.WhiteKnight, AllPieces.WhiteRook  , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
            ]
        }
        */
    }

    private  genMoves(): Util.MoveDictionary {
        let dict = {}
        for (let pos of Util.serializeBoardPosition()) {
            let index = Util.parsePosition(pos[0], pos[1])
            let pieceAtIndex = this.board[index]
            dict[index]  = generateMoves(this, pieceAtIndex, index)
        }
        return dict as Util.MoveDictionary
    }

    /** Checks if a piece at a position is able to make a move */
    public isValidPiece(pos: Util.BoardPosition) {
        return this.board[pos]!==AllPieces.NULL && Util.getPieceColor(this.board[pos])===this.current_side
    }

}