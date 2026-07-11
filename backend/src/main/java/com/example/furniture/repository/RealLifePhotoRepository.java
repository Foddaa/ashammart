package com.example.furniture.repository;


import com.example.furniture.model.RealLifePhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface RealLifePhotoRepository extends JpaRepository<RealLifePhoto, Long> {
    List<RealLifePhoto> findAllByOrderByCreatedAtDesc();
}
