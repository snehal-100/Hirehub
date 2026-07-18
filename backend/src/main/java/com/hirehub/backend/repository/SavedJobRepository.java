package com.hirehub.backend.repository;

import com.hirehub.backend.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByCandidateId(Long candidateId);
    List<SavedJob> findByCandidateUserEmail(String email);
    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);
    Optional<SavedJob> findByCandidateUserEmailAndJobId(String email, Long jobId);
}
