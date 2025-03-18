package com.openclassrooms.starterjwt.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SessionControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private ObjectMapper mapper;

    private Session testSession;

    @BeforeEach
    void setup() {
        // Creating a test session
        testSession = new Session();
        testSession.setName("Test Session");
        testSession.setDescription("Description test");
        testSession = sessionRepository.save(testSession);
    }

    @AfterEach
    void clean() {
        sessionRepository.deleteAll();
        sessionRepository.flush(); // Important pour réinitialiser les séquences d'IDs dans H2
    }

    @Test
    @DisplayName("Returns a valid session")
    public void testFindByIdReturnsSession() throws Exception {
        // Given - A session exists in the repository
        this.mockMvc.perform(get("/api/session/" + testSession.getId()))
                // When - A request is made to fetch the session by ID
                .andExpect(status().isOk())
                // Then - The response should be OK and contain the correct session
                .andExpect(content().string(containsString("Test Session")));
    }

    @Test
    @DisplayName("Returns 404 if session does not exist")
    public void testFindByIdReturnsNotFound() throws Exception {
        // When - A request is made to fetch a non-existent session
        this.mockMvc.perform(get("/api/session/9999"))
                // Then - The response should be 404 Not Found
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Returns all sessions")
    public void testFindAllReturnsSessions() throws Exception {
        // When - A request is made to fetch all sessions
        this.mockMvc.perform(get("/api/session"))
                // Then - The response should contain the expected session
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Test Session")));
    }

    @Test
    @DisplayName("Creates a new session")
    public void testCreateSession() throws Exception {
        // Given - A new session is created
        SessionDto newSession = new SessionDto();
        newSession.setName("New Session");
        newSession.setDescription("New Description");

        // When - A request is made to create the new session
        this.mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(newSession)))
                // Then - The response should be OK and contain the new session
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("New Session")));

        assertThat(sessionRepository.findAll().stream().anyMatch(session -> "New Session".equals(session.getName()))).isTrue();
    }

    @Test
    @DisplayName("Updates an existing session")
    public void testUpdateSession() throws Exception {
        // Given - An existing session is prepared for update
        SessionDto updatedSession = new SessionDto();
        updatedSession.setName("Updated Session");
        updatedSession.setDescription("Updated Description");

        // When - A request is made to update the session
        this.mockMvc.perform(put("/api/session/" + testSession.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(updatedSession)))
                // Then - The response should be OK and the session should be updated
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Updated Session")));

        assertThat(sessionRepository.findById(testSession.getId()).map(Session::getName).orElse("")).isEqualTo("Updated Session");
    }

    @Test
    @DisplayName("Deletes an existing session")
    public void testDeleteSession() throws Exception {
        // Given - An existing session exists in the repository
        this.mockMvc.perform(delete("/api/session/" + testSession.getId()))
                // When - A request is made to delete the session
                .andExpect(status().isOk())
                // Then - The response should be OK and the session should be deleted
                .andExpect(status().isOk());

        assertThat(sessionRepository.findById(testSession.getId())).isEmpty();
    }

    @Test
    @DisplayName("Adds a participant to a session")
    public void testParticipateInSession() throws Exception {
        // When - A request is made to add a participant
        this.mockMvc.perform(post("/api/session/" + testSession.getId() + "/participate/1"))
                // Then - The response should be OK
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Removes a participant from a session")
    public void testNoLongerParticipateInSession() throws Exception {
        // When - A request is made to remove a participant
        this.mockMvc.perform(delete("/api/session/" + testSession.getId() + "/participate/1"))
                // Then - The response should be OK
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Returns BadRequest if ID is invalid")
    public void testFindByIdReturnsBadRequest() throws Exception {
        // When - A request is made with an invalid ID
        this.mockMvc.perform(get("/api/session/invalidId"))
                // Then - The response should be BadRequest
                .andExpect(status().isBadRequest());
    }
}
