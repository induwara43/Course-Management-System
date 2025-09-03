package com.university.coursemanagement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "http://localhost:3000")
public class GradeController {

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;


    @GetMapping
    public ResponseEntity<List<Grade>> getAllGrades() {
        List<Grade> grades = gradeRepository.findAll();
        return ResponseEntity.ok(grades);
    }


    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Grade>> getGradesByStudent(@PathVariable Long studentId) {
        List<Grade> grades = gradeRepository.findByStudentId(studentId);
        return ResponseEntity.ok(grades);
    }


    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Grade>> getGradesByCourse(@PathVariable Long courseId) {
        List<Grade> grades = gradeRepository.findByCourseId(courseId);
        return ResponseEntity.ok(grades);
    }


    @GetMapping("/student/{studentId}/gpa")
    public ResponseEntity<Double> getStudentGPA(@PathVariable Long studentId) {
        Double gpa = gradeRepository.calculateGPAByStudentId(studentId);
        return ResponseEntity.ok(gpa != null ? gpa : 0.0);
    }


    @PostMapping
    public ResponseEntity<?> createOrUpdateGrade(@RequestBody GradeRequest request) {

        Optional<Student> studentOpt = studentRepository.findById(request.getStudentId());
        Optional<Course> courseOpt = courseRepository.findById(request.getCourseId());

        if (!studentOpt.isPresent() || !courseOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Student or Course not found");
        }


        Optional<Grade> existingGrade = gradeRepository.findByStudentIdAndCourseId(
                request.getStudentId(), request.getCourseId());

        Grade grade;
        if (existingGrade.isPresent()) {

            grade = existingGrade.get();
            grade.setScore(request.getScore());
            grade.setRemarks(request.getRemarks());
        } else {

            grade = new Grade(studentOpt.get(), courseOpt.get(), request.getScore());
            grade.setRemarks(request.getRemarks());
        }

        Grade savedGrade = gradeRepository.save(grade);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedGrade);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Grade> updateGrade(@PathVariable Long id, @RequestBody GradeRequest request) {
        Optional<Grade> gradeOpt = gradeRepository.findById(id);

        if (gradeOpt.isPresent()) {
            Grade grade = gradeOpt.get();
            grade.setScore(request.getScore());
            grade.setRemarks(request.getRemarks());

            Grade updatedGrade = gradeRepository.save(grade);
            return ResponseEntity.ok(updatedGrade);
        }

        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGrade(@PathVariable Long id) {
        if (gradeRepository.existsById(id)) {
            gradeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }


    public static class GradeRequest {
        private Long studentId;
        private Long courseId;
        private Double score;
        private String remarks;


        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }

        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }

        public Double getScore() { return score; }
        public void setScore(Double score) { this.score = score; }

        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
    }
}
