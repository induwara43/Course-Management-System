package com.university.coursemanagement;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String title;

    private String description;
    private Integer credits;

    @ManyToMany(mappedBy = "enrolledCourses")
    @JsonIgnore
    private Set<Student> enrolledStudents = new HashSet<>();


    public Course() {}

    public Course(String code, String title, String description, Integer credits) {
        this.code = code.toUpperCase();
        this.title = title;
        this.description = description;
        this.credits = credits;
    }


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code.toUpperCase(); }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }

    public Set<Student> getEnrolledStudents() { return enrolledStudents; }
    public void setEnrolledStudents(Set<Student> enrolledStudents) { this.enrolledStudents = enrolledStudents; }
}