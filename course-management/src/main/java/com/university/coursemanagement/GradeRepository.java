package com.university.coursemanagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {

    // Find grades by student
    List<Grade> findByStudentId(Long studentId);

    // Find grades by course
    List<Grade> findByCourseId(Long courseId);

    // Find specific grade for student in course
    Optional<Grade> findByStudentIdAndCourseId(Long studentId, Long courseId);

    // Find grades by status (PASS, COMPLETE, INCOMPLETE)
    List<Grade> findByStatus(String status);

    // Calculate GPA using ALL courses (including incomplete with 0 GPV)
    @Query("SELECT CASE WHEN SUM(g.course.credits) > 0 THEN " +
            "SUM(g.gradePointValue * g.course.credits) / SUM(g.course.credits) " +
            "ELSE 0.0 END " +
            "FROM Grade g WHERE g.student.id = :studentId")
    Double calculateGPAByStudentId(@Param("studentId") Long studentId);

    // Get total credits attempted by student (ALL courses)
    @Query("SELECT COALESCE(SUM(g.course.credits), 0) FROM Grade g WHERE g.student.id = :studentId")
    Integer getTotalCreditsByStudentId(@Param("studentId") Long studentId);

    // Get total credits passed by student (PASS status only)
    @Query("SELECT COALESCE(SUM(g.course.credits), 0) FROM Grade g WHERE g.student.id = :studentId AND g.status = 'PASS'")
    Integer getTotalCreditsPassedByStudentId(@Param("studentId") Long studentId);

    // Get total credits completed (PASS + COMPLETE status)
    @Query("SELECT COALESCE(SUM(g.course.credits), 0) FROM Grade g WHERE g.student.id = :studentId AND (g.status = 'PASS' OR g.status = 'COMPLETE')")
    Integer getTotalCreditsCompletedByStudentId(@Param("studentId") Long studentId);
}
