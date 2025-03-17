package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Objects;

class SessionMapperTest {

    private SessionMapper sessionMapper;
    private TeacherService teacherService;
    private UserService userService;

    @BeforeEach
    void setUp() {
        teacherService = mock(TeacherService.class);
        userService = mock(UserService.class);

        sessionMapper = Mappers.getMapper(SessionMapper.class);

        // Injection manuelle des dépendances
        sessionMapper.teacherService = teacherService;
        sessionMapper.userService = userService;
    }

    @Test
    void toEntity_shouldMapDtoToEntityWithAllFields() {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setDescription("Test description");
        sessionDto.setTeacher_id(1L);
        sessionDto.setUsers(Arrays.asList(2L, 3L));

        Teacher teacher = new Teacher();
        teacher.setId(1L);

        when(teacherService.findById(1L)).thenReturn(teacher);
        when(userService.findById(2L)).thenReturn(new User(2L,"charlie.green@example.com",  "Green","Charlie","vert123",true, LocalDateTime.parse("2024-08-20T21:33:08"),LocalDateTime.parse("2024-08-20T21:33:08")));
        when(userService.findById(3L)).thenReturn(new User(3L,"dana.blue@example.com", "Blue", "Dana" ,"bleu123",true, LocalDateTime.parse("2024-08-20T21:33:08"),LocalDateTime.parse("2024-08-20T21:33:08")));

        Session session = sessionMapper.toEntity(sessionDto);

        assertNotNull(session);
        assertEquals("Test description", session.getDescription());
        assertEquals(teacher.getId(), session.getTeacher().getId());
        assertEquals(2, session.getUsers().size());
        assertTrue(session.getUsers().stream().anyMatch(user -> user.getId().equals(2L)));
        assertTrue(session.getUsers().stream().anyMatch(user -> user.getId().equals(3L)));
    }

    @Test
    void toEntity_shouldHandleNullTeacherAndEmptyUsers() {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setDescription("Test description");
        sessionDto.setTeacher_id(null);
        sessionDto.setUsers(Collections.emptyList());

        Session session = sessionMapper.toEntity(sessionDto);

        assertNotNull(session);
        assertEquals("Test description", session.getDescription());
        assertNull(session.getTeacher());
        assertTrue(session.getUsers().isEmpty());
    }

    @Test
    void toEntity_shouldIgnoreInvalidUserIds() {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setUsers(Arrays.asList(99L, 100L));

        when(userService.findById(99L)).thenReturn(null);
        when(userService.findById(100L)).thenReturn(null);

        Session session = sessionMapper.toEntity(sessionDto);

        assertNotNull(session);
        session.getUsers().removeIf(Objects::isNull);
        assertTrue(session.getUsers().isEmpty());
    }

    @Test
    void toDto_shouldMapEntityToDtoWithAllFields() {
        Session session = new Session();
        session.setDescription("Sample description");

        Teacher teacher = new Teacher();
        teacher.setId(1L);
        session.setTeacher(teacher);

        User user1 = new User();
        user1.setId(2L);
        User user2 = new User();
        user2.setId(3L);
        session.setUsers(Arrays.asList(user1, user2));

        SessionDto sessionDto = sessionMapper.toDto(session);

        assertNotNull(sessionDto);
        assertEquals("Sample description", sessionDto.getDescription());
        assertEquals(1L, sessionDto.getTeacher_id());
        assertEquals(2, sessionDto.getUsers().size());
        assertTrue(sessionDto.getUsers().containsAll(Arrays.asList(2L, 3L)));
    }

    @Test
    void toDto_shouldHandleNullTeacherAndEmptyUsers() {
        Session session = new Session();
        session.setDescription("Sample description");
        session.setTeacher(null);
        session.setUsers(Collections.emptyList());

        SessionDto sessionDto = sessionMapper.toDto(session);

        assertNotNull(sessionDto);
        assertEquals("Sample description", sessionDto.getDescription());
        assertNull(sessionDto.getTeacher_id());
        assertTrue(sessionDto.getUsers().isEmpty());
    }

    @Test
    void toEntityList_shouldMapDtoListToEntityList() {
        SessionDto dto1 = new SessionDto();
        dto1.setDescription("Session 1");
        dto1.setTeacher_id(1L);
        dto1.setUsers(Arrays.asList(2L, 3L));

        SessionDto dto2 = new SessionDto();
        dto2.setDescription("Session 2");
        dto2.setTeacher_id(2L);
        dto2.setUsers(Arrays.asList(4L, 5L));

        when(teacherService.findById(1L)).thenReturn(new Teacher(1L,"Brown", "Alice", LocalDateTime.parse("2024-08-20T21:33:08"),LocalDateTime.parse("2024-08-20T21:33:08")));
        when(teacherService.findById(2L)).thenReturn(new Teacher(2L,"White", "Bob", LocalDateTime.parse("2024-08-20T21:33:08"),LocalDateTime.parse("2024-08-20T21:33:08")));

        when(userService.findById(2L)).thenReturn(new User(2L, "alice.green@example.com", "Green", "Alice", "password", true, LocalDateTime.now(), LocalDateTime.now()));
        when(userService.findById(3L)).thenReturn(new User(3L, "bob.white@example.com", "White", "Bob", "password", true, LocalDateTime.now(), LocalDateTime.now()));
        when(userService.findById(4L)).thenReturn(new User(4L, "charlie.blue@example.com", "Blue", "Charlie", "password", true, LocalDateTime.now(), LocalDateTime.now()));
        when(userService.findById(5L)).thenReturn(new User(5L, "dana.black@example.com", "Black", "Dana", "password", true, LocalDateTime.now(), LocalDateTime.now()));

        List<Session> sessionList = sessionMapper.toEntity(Arrays.asList(dto1, dto2));

        assertEquals(2, sessionList.size());
        assertEquals("Session 1", sessionList.get(0).getDescription());
        assertEquals(2, sessionList.get(0).getUsers().size());

        assertEquals("Session 2", sessionList.get(1).getDescription());
        assertEquals(2, sessionList.get(1).getUsers().size());
    }

    @Test
    void toDtoList_shouldMapEntityListToDtoList() {
        Session session1 = new Session();
        session1.setDescription("Session 1");
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        session1.setTeacher(teacher1);
        session1.setUsers(Arrays.asList(new User(2L,"alice.green@example.com", "Green", "Alice", "password", true, LocalDateTime.now(), LocalDateTime.now()), new User(3L,"bob.white@example.com", "White", "Bob", "password", true, LocalDateTime.now(), LocalDateTime.now())));

        Session session2 = new Session();
        session2.setDescription("Session 2");
        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        session2.setTeacher(teacher2);
        session2.setUsers(Arrays.asList(new User(4L,"charlie.blue@example.com", "Blue", "Charlie", "password", true, LocalDateTime.now(), LocalDateTime.now()), new User(5L, "dana.black@example.com", "Black", "Dana", "password", true, LocalDateTime.now(), LocalDateTime.now())));

        List<SessionDto> dtoList = sessionMapper.toDto(Arrays.asList(session1, session2));

        assertEquals(2, dtoList.size());
        assertEquals("Session 1", dtoList.get(0).getDescription());
        assertEquals(2, dtoList.get(0).getUsers().size());

        assertEquals("Session 2", dtoList.get(1).getDescription());
        assertEquals(2, dtoList.get(1).getUsers().size());
    }

    @Test
    void toEntity_shouldReturnNull_WhenSessionDtoIsNull() {
        SessionDto sessionDto = null;

        Session session = sessionMapper.toEntity(sessionDto);

        assertNull(session);
    }

    @Test
    void toDto_shouldReturnNull_WhenSessionIsNull() {
        Session session = null;

        SessionDto sessionDto = sessionMapper.toDto(session);

        assertNull(sessionDto);
    }
}