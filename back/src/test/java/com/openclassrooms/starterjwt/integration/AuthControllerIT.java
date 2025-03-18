package com.openclassrooms.starterjwt.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerIT {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ObjectMapper mapper;

    final private BCryptPasswordEncoder passwordEncoder=new BCryptPasswordEncoder();

    final User testUser=User.builder()
            .email("987654321@test.com")
            .password(passwordEncoder.encode("Aa123456!"))
            .lastName("MockLN")
            .firstName("MockFN")
            .build();

    @AfterEach
    void clean(){
        userRepository.deleteAll();
        userRepository.flush(); // Important pour réinitialiser les séquences d'IDs dans H2
    }

    @Test
    @DisplayName("When I request login with correct credentials, response is OK and returns correct data")
    public void testLoginUserWorksWithCorrectCredential() throws Exception {
        // Given - A test user exists in the repository
        userRepository.save(testUser);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("987654321@test.com");
        loginRequest.setPassword("Aa123456!");

        // When - A request is made to log in with correct credentials
        this.mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(loginRequest)))

                // Then - The response should be OK and contain the correct data
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("LN")))
                .andExpect(content().string(containsString("false")));

        assertThat(userRepository.findByEmail("987654321@test.com").isPresent()).isTrue();
    }

    @Test
    @DisplayName("When I request register with correct data, response is OK")
    public void testRegisterUserWorks() throws Exception {
        // Given - A valid signup request is prepared
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("987654321@test.com");
        signupRequest.setPassword("Aa123456!");
        signupRequest.setLastName("MockLN");
        signupRequest.setFirstName("MockFN");

        // When - A request is made to register the user
        this.mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(signupRequest)))

                // Then - The response should be OK and the user should be created
                .andExpect(status().isOk());
        assertThat(userRepository.findByEmail("987654321@test.com").isPresent()).isTrue();
    }

    @Test
    @DisplayName("When I request register but email is already taken, response is BadRequest and returns message")
    public void testRegisterUserDontWorkIfEmailIsAlreadyTaken() throws Exception {
        // Given - A test user exists in the repository
        userRepository.save(testUser);

        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("987654321@test.com");
        signupRequest.setPassword("Aa123456!");
        signupRequest.setLastName("MockLN");
        signupRequest.setFirstName("MockFN");

        // When - A request is made to register a user with an already taken email
        this.mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(signupRequest)))

                // Then - The response should be BadRequest and contain the correct error message
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Email is already taken")));
    }
}