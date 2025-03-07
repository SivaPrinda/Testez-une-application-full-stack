package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionControllerTest {

    @Mock
    private SessionService sessionService;

    @Mock
    private SessionMapper sessionMapper;

    @InjectMocks
    private SessionController sessionController;

    private Session testSession;
    private SessionDto testSessionDto;

    @BeforeEach
    void setUp() {
        testSession = new Session();
        testSession.setId(1L);
        testSession.setName("Test Session");

        testSessionDto = new SessionDto();
        testSessionDto.setId(1L);
        testSessionDto.setName("Test Session");
    }

    @Test
    void findById_ShouldReturnSession_WhenExists() {
        when(sessionService.getById(1L)).thenReturn(testSession);
        when(sessionMapper.toDto(testSession)).thenReturn(testSessionDto);

        ResponseEntity<?> response = sessionController.findById("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(testSessionDto);

        verify(sessionService, times(1)).getById(1L);
        verify(sessionMapper, times(1)).toDto(testSession);
    }

    @Test
    void findById_ShouldReturnNotFound_WhenDoesNotExist() {
        when(sessionService.getById(999L)).thenReturn(null);

        ResponseEntity<?> response = sessionController.findById("999");

        assertThat(response.getStatusCodeValue()).isEqualTo(404);
        verify(sessionService, times(1)).getById(999L);
        verifyNoInteractions(sessionMapper);
    }

    @Test
    void findById_ShouldReturnBadRequest_WhenIdIsInvalid() {
        ResponseEntity<?> response = sessionController.findById("invalid");

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        verifyNoInteractions(sessionService);
        verifyNoInteractions(sessionMapper);
    }

    @Test
    void findAll_ShouldReturnSessions() {
        List<Session> sessionList = Arrays.asList(testSession);
        List<SessionDto> sessionDtoList = Arrays.asList(testSessionDto);

        when(sessionService.findAll()).thenReturn(sessionList);
        when(sessionMapper.toDto(sessionList)).thenReturn(sessionDtoList);

        ResponseEntity<?> response = sessionController.findAll();

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(sessionDtoList);

        verify(sessionService, times(1)).findAll();
        verify(sessionMapper, times(1)).toDto(sessionList);
    }

    @Test
    void create_ShouldCreateSession() {
        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(testSession);
        when(sessionService.create(any(Session.class))).thenReturn(testSession);
        when(sessionMapper.toDto(any(Session.class))).thenReturn(testSessionDto);

        ResponseEntity<?> response = sessionController.create(testSessionDto);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        verify(sessionService, times(1)).create(any(Session.class));
        verify(sessionMapper, times(1)).toEntity(any(SessionDto.class));
    }

    @Test
    void update_ShouldUpdateSession() {
        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(testSession);
        when(sessionService.update(eq(1L), any(Session.class))).thenReturn(testSession);
        when(sessionMapper.toDto(any(Session.class))).thenReturn(testSessionDto);

        ResponseEntity<?> response = sessionController.update("1", testSessionDto);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        verify(sessionService, times(1)).update(eq(1L), any(Session.class));
        verify(sessionMapper, times(1)).toEntity(any(SessionDto.class));
    }

    @Test
    void delete_ShouldDeleteSession() {
        when(sessionService.getById(1L)).thenReturn(testSession);
        doNothing().when(sessionService).delete(1L);

        ResponseEntity<?> response = sessionController.save("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        verify(sessionService, times(1)).delete(1L);
    }

    @Test
    void participate_ShouldReturnOk() {
        doNothing().when(sessionService).participate(1L, 10L);

        ResponseEntity<?> response = sessionController.participate("1", "10");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        verify(sessionService, times(1)).participate(1L, 10L);
    }

    @Test
    void noLongerParticipate_ShouldReturnOk() {
        doNothing().when(sessionService).noLongerParticipate(1L, 10L);

        ResponseEntity<?> response = sessionController.noLongerParticipate("1", "10");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        verify(sessionService, times(1)).noLongerParticipate(1L, 10L);
    }
}
