import { AllPieces, CastleType } from "../../src/engine/util"

export const defaultCastling  = CastleType.NoCastling
                                | CastleType.BKingCastle
                                | CastleType.BQueenCastle
                                | CastleType.WKingCastle
                                | CastleType.WQueenCastle

export const defaultBoardState = [
    AllPieces.BlackRook  , AllPieces.BlackKnight, AllPieces.BlackBishop, AllPieces.BlackQueen , AllPieces.BlackKing  , AllPieces.BlackBishop, AllPieces.BlackKnight, AllPieces.BlackRook  , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
    AllPieces.BlackPawn  , AllPieces.BlackPawn  , AllPieces.BlackPawn  , AllPieces.BlackPawn  , AllPieces.BlackPawn  , AllPieces.BlackPawn  , AllPieces.BlackPawn  , AllPieces.BlackPawn  , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
    AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
    AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
    AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
    AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL       , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
    AllPieces.WhitePawn  , AllPieces.WhitePawn  , AllPieces.WhitePawn  , AllPieces.WhitePawn  , AllPieces.WhitePawn  , AllPieces.WhitePawn  , AllPieces.WhitePawn  , AllPieces.WhitePawn  , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
    AllPieces.WhiteRook  , AllPieces.WhiteKnight, AllPieces.WhiteBishop, AllPieces.WhiteQueen , AllPieces.WhiteKing  , AllPieces.WhiteBishop, AllPieces.WhiteKnight, AllPieces.WhiteRook  , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL , AllPieces.NULL ,
]