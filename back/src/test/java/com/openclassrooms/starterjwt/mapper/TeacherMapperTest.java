package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class TeacherMapperTest {

    private TeacherMapper teacherMapper;

    @BeforeEach
    public void setUp() {
        teacherMapper = Mappers.getMapper(TeacherMapper.class);
    }

    @Test
    public void testToEntity_ShouldMapCorrectly() {
        TeacherDto dto = new TeacherDto();
        dto.setId(1L);
        dto.setFirstName("John");
        dto.setLastName("Doe");
        //dto.setEmail("john.doe@example.com");

        Teacher teacher = teacherMapper.toEntity(dto);

        assertNotNull(teacher);
        assertEquals(dto.getId(), teacher.getId());
        assertEquals(dto.getFirstName(), teacher.getFirstName());
        assertEquals(dto.getLastName(), teacher.getLastName());
    }

    @Test
    public void testToEntity_ShouldReturnNull_WhenDtoIsNull() {
        assertNull(teacherMapper.toEntity((TeacherDto) null));
    }

    @Test
    public void testToDto_ShouldMapCorrectly() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        TeacherDto dto = teacherMapper.toDto(teacher);

        assertNotNull(dto);
        assertEquals(teacher.getId(), dto.getId());
        assertEquals(teacher.getFirstName(), dto.getFirstName());
        assertEquals(teacher.getLastName(), dto.getLastName());
    }

    @Test
    public void testToDto_ShouldReturnNull_WhenEntityIsNull() {
        assertNull(teacherMapper.toDto((Teacher) null));
    }

    @Test
    public void testToEntityList_ShouldMapCorrectly() {
        TeacherDto dto1 = new TeacherDto(1L, "Brown", "Alice", LocalDateTime.parse("2024-08-20T21:33:08"),LocalDateTime.parse("2024-08-20T21:33:08"));
        TeacherDto dto2 = new TeacherDto(2L, "White", "Bob", LocalDateTime.parse("2024-08-20T21:33:08"),LocalDateTime.parse("2024-08-20T21:33:08"));

        List<Teacher> teachers = teacherMapper.toEntity(Arrays.asList(dto1, dto2));

        assertEquals(2, teachers.size());
        assertEquals("Alice", teachers.get(0).getFirstName());
        assertEquals("Bob", teachers.get(1).getFirstName());
    }

    @Test
    public void testToDtoList_ShouldMapCorrectly() {
        Teacher teacher1 = new Teacher(1L, "Charlie", "Green",LocalDateTime.parse("2024-08-20T21:33:08"),LocalDateTime.parse("2024-08-20T21:33:08"));
        Teacher teacher2 = new Teacher(2L, "Dana", "Blue", LocalDateTime.parse("2024-08-20T21:33:08"),LocalDateTime.parse("2024-08-20T21:33:08"));

        List<TeacherDto> dtos = teacherMapper.toDto(Arrays.asList(teacher1, teacher2));

        assertEquals(2, dtos.size());
        assertEquals("Green", dtos.get(0).getFirstName());
        assertEquals("Blue", dtos.get(1).getFirstName());
    }
}
