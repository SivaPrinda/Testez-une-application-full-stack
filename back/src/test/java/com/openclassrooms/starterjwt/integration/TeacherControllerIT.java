package com.openclassrooms.starterjwt.integration;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TeacherControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TeacherRepository teacherRepository;

    @BeforeEach
    void setUp() {
        // Given - A teacher is created and saved in the repository
        Teacher testTeacher = new Teacher();
        testTeacher.setId(1L);
        testTeacher.setFirstName("John");
        testTeacher.setLastName("Doe");
        teacherRepository.save(testTeacher);
    }

    @AfterEach
    void cleanUp() {
        teacherRepository.deleteAll();
        teacherRepository.flush(); // Important pour réinitialiser les séquences d'IDs dans H2
    }

    @Test
    void findById_ShouldReturnTeacher_WhenExists() throws Exception {
        // When - A request is made to retrieve the teacher by ID
        this.mockMvc.perform(get("/api/teacher/1"))
                // Then - The response should be OK and contain the teacher's details
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("John")))
                .andExpect(content().string(containsString("Doe")));
    }

    @Test
    void findById_ShouldReturnNotFound_WhenDoesNotExist() throws Exception {
        // When - A request is made for a non-existent teacher
        this.mockMvc.perform(get("/api/teacher/999"))
                // Then - The response should be 404 Not Found
                .andExpect(status().isNotFound());
    }

    @Test
    void findById_ShouldReturnBadRequest_WhenIdIsInvalid() throws Exception {
        // When - A request is made with an invalid teacher ID
        this.mockMvc.perform(get("/api/teacher/invalid"))
                // Then - The response should be 400 Bad Request
                .andExpect(status().isBadRequest());
    }

    @Test
    void findAll_ShouldReturnTeachers() throws Exception {
        // When - A request is made to retrieve all teachers
        this.mockMvc.perform(get("/api/teacher"))
                // Then - The response should be OK and contain the teacher's details
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("John")))
                .andExpect(content().string(containsString("Doe")));
    }
}
