package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    private Session session;
    private User user;

    @BeforeEach
    void setUp() {
        // Given - A test session and user are prepared
        session = new Session();
        session.setId(1L);
        session.setUsers(new ArrayList<>());

        user = new User();
        user.setId(1L);
    }

    @Test
    void testCreate() {
        // Given - The repository will successfully save the session
        when(sessionRepository.save(session)).thenReturn(session);

        // When - The service's create method is called
        Session result = sessionService.create(session);

        // Then - The response should contain the created session
        assertNotNull(result);
        assertEquals(session.getId(), result.getId());
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testDelete() {
        // Given - The repository will successfully delete the session
        doNothing().when(sessionRepository).deleteById(1L);

        // When - The service's delete method is called
        sessionService.delete(1L);

        // Then - The repository's deleteById method should be called once
        verify(sessionRepository, times(1)).deleteById(1L);
    }

    @Test
    void testFindAll() {
        // Given - The repository returns a list of sessions
        List<Session> sessions = Arrays.asList(session);
        when(sessionRepository.findAll()).thenReturn(sessions);

        // When - The service's findAll method is called
        List<Session> result = sessionService.findAll();

        // Then - The response should contain the expected session list
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        verify(sessionRepository, times(1)).findAll();
    }

    @Test
    void testGetById_Found() {
        // Given - The repository returns the expected session when requested
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        // When - The service's getById method is called
        Session result = sessionService.getById(1L);

        // Then - The response should contain the expected session
        assertNotNull(result);
        assertEquals(session.getId(), result.getId());
        verify(sessionRepository, times(1)).findById(1L);
    }

    @Test
    void testGetById_NotFound() {
        // Given - The repository returns empty for a non-existent session
        when(sessionRepository.findById(2L)).thenReturn(Optional.empty());

        // When - The service's getById method is called
        Session result = sessionService.getById(2L);

        // Then - The response should be null
        assertNull(result);
        verify(sessionRepository, times(1)).findById(2L);
    }

    @Test
    void testUpdate() {
        // Given - The repository will successfully update the session
        when(sessionRepository.save(session)).thenReturn(session);

        // When - The service's update method is called
        Session updatedSession = sessionService.update(1L, session);

        // Then - The response should contain the updated session
        assertNotNull(updatedSession);
        assertEquals(1L, updatedSession.getId());
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testParticipate_Success() {
        // Given - The repository returns the session and user, and saves successfully
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(sessionRepository.save(session)).thenReturn(session);

        // When - The service's participate method is called
        sessionService.participate(1L, 1L);

        // Then - The user should be added to the session's user list
        assertTrue(session.getUsers().contains(user));
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testParticipate_SessionNotFound() {
        // Given - The repository returns empty for a non-existent session
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        // When - The service's participate method is called
        // Then - A NotFoundException should be thrown
        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));
    }

    @Test
    void testParticipate_UserNotFound() {
        // Given - The repository returns the session but no user
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When - The service's participate method is called
        // Then - A NotFoundException should be thrown
        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));
    }

    @Test
    void testParticipate_AlreadyParticipating() {
        // Given - The session already contains the user
        session.getUsers().add(user);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // When - The service's participate method is called
        // Then - A BadRequestException should be thrown
        assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 1L));
    }

    @Test
    void testNoLongerParticipate_Success() {
        // Given - The repository returns the session with the user already participating
        session.getUsers().add(user);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(sessionRepository.save(session)).thenReturn(session);

        // When - The service's noLongerParticipate method is called
        sessionService.noLongerParticipate(1L, 1L);

        // Then - The user should be removed from the session's user list
        assertFalse(session.getUsers().contains(user));
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testNoLongerParticipate_SessionNotFound() {
        // Given - The repository returns empty for a non-existent session
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        // When - The service's noLongerParticipate method is called
        // Then - A NotFoundException should be thrown
        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 1L));
    }

    @Test
    void testNoLongerParticipate_UserNotParticipating() {
        // Given - The repository returns the session without the user participating
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        // When - The service's noLongerParticipate method is called
        // Then - A BadRequestException should be thrown
        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 1L));
    }
}
