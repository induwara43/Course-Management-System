package com.university.coursemanagement;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "grades")
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private Double score; // Numeric score (0-100)

    @Column(length = 3)
    private String letterGrade; // A+, A, A-, B+, B, B-, C+, C, C-, D+, D, E

    @Column(nullable = false)
    private Double gradePointValue; // GPV according to the scale

    @Column(length = 15)
    private String status; // PASS, COMPLETE, INCOMPLETE

    private LocalDate gradeDate;

    private String remarks;

    // Constructors
    public Grade() {}

    public Grade(Student student, Course course, Double score) {
        this.student = student;
        this.course = course;
        this.score = score;
        this.letterGrade = calculateLetterGrade(score);
        this.gradePointValue = calculateGradePointValue(score);
        this.status = calculateStatus(score);
        this.gradeDate = LocalDate.now();
    }

    // Method to calculate letter grade based on university scale
    private String calculateLetterGrade(Double score) {
        if (score >= 85) return "A+";
        else if (score >= 70) return "A";
        else if (score >= 65) return "A-";
        else if (score >= 60) return "B+";
        else if (score >= 55) return "B";
        else if (score >= 50) return "B-";
        else if (score >= 45) return "C+";
        else if (score >= 40) return "C";
        else if (score >= 35) return "C-";
        else if (score >= 30) return "D+";
        else if (score >= 25) return "D";
        else return "E";
    }

    // Method to calculate Grade Point Value (GPV)
    private Double calculateGradePointValue(Double score) {
        if (score >= 85) return 4.00;      // A+
        else if (score >= 70) return 4.00; // A
        else if (score >= 65) return 3.70; // A-
        else if (score >= 60) return 3.30; // B+
        else if (score >= 55) return 3.00; // B
        else if (score >= 50) return 2.70; // B-
        else if (score >= 45) return 2.30; // C+
        else if (score >= 40) return 2.00; // C
        else if (score >= 35) return 1.70; // C-
        else if (score >= 30) return 1.30; // D+
        else if (score >= 25) return 1.00; // D
        else return 0.00;                  // E
    }

    // Method to calculate status based on new system
    private String calculateStatus(Double score) {
        if (score >= 40) return "PASS";        // C and above
        else if (score >= 25) return "COMPLETE"; // D, D+, C-
        else return "INCOMPLETE";              // E
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Double getScore() { return score; }
    public void setScore(Double score) {
        this.score = score;
        this.letterGrade = calculateLetterGrade(score);
        this.gradePointValue = calculateGradePointValue(score);
        this.status = calculateStatus(score);
    }

    public String getLetterGrade() { return letterGrade; }
    public void setLetterGrade(String letterGrade) { this.letterGrade = letterGrade; }

    public Double getGradePointValue() { return gradePointValue; }
    public void setGradePointValue(Double gradePointValue) { this.gradePointValue = gradePointValue; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getGradeDate() { return gradeDate; }
    public void setGradeDate(LocalDate gradeDate) { this.gradeDate = gradeDate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
