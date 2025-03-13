package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    private Teacher teacher1;
    private Teacher teacher2;

    @BeforeEach
    void setUp() {
        // Given - A test teacher dataset is prepared
        teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setFirstName("John");
        teacher1.setLastName("Doe");

        teacher2 = new Teacher();
        teacher2.setId(2L);
        teacher2.setFirstName("Jane");
        teacher2.setLastName("Smith");
    }

    @Test
    void findAll_ShouldReturnListOfTeachers() {
        // Given - The repository returns a list of teachers
        List<Teacher> expectedTeachers = Arrays.asList(teacher1, teacher2);
        when(teacherRepository.findAll()).thenReturn(expectedTeachers);

        // When - The service's findAll method is called
        List<Teacher> actualTeachers = teacherService.findAll();

        // Then - The response should contain the expected list of teachers
        assertEquals(2, actualTeachers.size());
        assertEquals(expectedTeachers, actualTeachers);
        verify(teacherRepository, times(1)).findAll();
    }

    @Test
    void findById_WhenTeacherExists_ShouldReturnTeacher() {
        // Given - The repository returns the expected teacher when requested
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher1));

        // When - The service's findById method is called
        Teacher foundTeacher = teacherService.findById(1L);

        // Then - The response should contain the expected teacher details
        assertNotNull(foundTeacher);
        assertEquals(1L, foundTeacher.getId());
        assertEquals("John", foundTeacher.getFirstName());
        verify(teacherRepository, times(1)).findById(1L);
    }

    @Test
    void findById_WhenTeacherDoesNotExist_ShouldReturnNull() {
        // Given - The repository returns empty for a non-existent teacher
        when(teacherRepository.findById(99L)).thenReturn(Optional.empty());

        // When - The service's findById method is called
        Teacher foundTeacher = teacherService.findById(99L);

        // Then - The response should be null
        assertNull(foundTeacher);
        verify(teacherRepository, times(1)).findById(99L);
    }
}
