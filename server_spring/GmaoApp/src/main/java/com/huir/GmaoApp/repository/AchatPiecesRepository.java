package com.huir.GmaoApp.repository;
import com.huir.GmaoApp.model.AchatPiece;
import com.huir.GmaoApp.model.AttributEquipements;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AchatPiecesRepository extends JpaRepository<AchatPiece, Long> {


    List<AchatPiece> findByPieceDetacheeId(Long pieceId);

}


