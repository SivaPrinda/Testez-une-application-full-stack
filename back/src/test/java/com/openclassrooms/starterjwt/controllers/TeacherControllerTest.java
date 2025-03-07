package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeacherControllerTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private TeacherMapper teacherMapper;

    @InjectMocks
    private TeacherController teacherController;

    private Teacher testTeacher;
    private TeacherDto testTeacherDto;

    @BeforeEach
    void setUp() {
        testTeacher = new Teacher();
        testTeacher.setId(1L);
        testTeacher.setFirstName("John");
        testTeacher.setLastName("Doe");

        testTeacherDto = new TeacherDto();
        testTeacherDto.setId(1L);
        testTeacherDto.setFirstName("John");
        testTeacherDto.setLastName("Doe");
    }

    @Test
    void findById_ShouldReturnTeacher_WhenExists() {
        when(teacherService.findById(1L)).thenReturn(testTeacher);
        when(teacherMapper.toDto(testTeacher)).thenReturn(testTeacherDto);

        ResponseEntity<?> response = teacherController.findById("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(testTeacherDto);

        verify(teacherService, times(1)).findById(1L);
        verify(teacherMapper, times(1)).toDto(testTeacher);
    }

    @Test
    void findById_ShouldReturnNotFound_WhenDoesNotExist() {
        when(teacherService.findById(999L)).thenReturn(null);

        ResponseEntity<?> response = teacherController.findById("999");

        assertThat(response.getStatusCodeValue()).isEqualTo(404);
        verify(teacherService, times(1)).findById(999L);
        verifyNoInteractions(teacherMapper);
    }

    @Test
    void findById_ShouldReturnBadRequest_WhenIdIsInvalid() {
        ResponseEntity<?> response = teacherController.findById("invalid");

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        verifyNoInteractions(teacherService);
        verifyNoInteractions(teacherMapper);
    }

    @Test
    void findAll_ShouldReturnTeachers() {
        List<Teacher> teacherList = Arrays.asList(testTeacher);
        List<TeacherDto> teacherDtoList = Arrays.asList(testTeacherDto);

        when(teacherService.findAll()).thenReturn(teacherList);
        when(teacherMapper.toDto(teacherList)).thenReturn(teacherDtoList);

        ResponseEntity<?> response = teacherController.findAll();

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(teacherDtoList);

        verify(teacherService, times(1)).findAll();
        verify(teacherMapper, times(1)).toDto(teacherList);
    }
}
