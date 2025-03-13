package com.openclassrooms.starterjwt.integration;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.hamcrest.Matchers.containsString;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerIT {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;

    final private User testUser=User.builder()
            .email("987654321@test.com")
            .password("Aa123456!")
            .lastName("MockLN")
            .firstName("MockFN")
            .build();

    @AfterEach
    void clean(){
        userRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles="USER")
    @DisplayName("When auth user requests get one user, response is OK and returns data")
    public void testGetUserByIdFindsValidUser() throws Exception {
        // Given - A test user is saved in the repository
        Long testUserId=userRepository.save(testUser).getId();

        // When - A request is made to get the user by ID
        this.mockMvc.perform(get("/api/user/"+testUserId))

                // Then - The response should be OK and contain the correct user data
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("MockFN")));
    }

    @Test
    @DisplayName("When unAuthorized user requests get one user, response is unAuthorized")
    public void testDeleteUserByIdIsRejected() throws Exception {
        // Given - A test user is saved in the repository
        Long testUserId=userRepository.save(testUser).getId();

        // When - An unauthorized request is made to delete the user
        this.mockMvc.perform(delete("/api/user/"+testUserId))

                // Then - The response should be Unauthorized
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("When unAuthorized user requests delete one user, response is unAuthorized")
    public void testDeleteUserByIdIsRejectedWhenUserIsNotValid() throws Exception {
        // Given - A test user is saved in the repository
        Long testUserId=userRepository.save(testUser).getId();

        // When - A request is made to delete the user with an invalid user
        this.mockMvc.perform(delete("/api/user/"+testUserId).with(user("abc@def.com")))

                // Then - The response should be Unauthorized
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("When auth user requests delete one user, response is OK")
    public void testDeleteUserByIdWorksWhenUserIsValid() throws Exception {
        // Given - A test user is saved in the repository
        Long testUserId=userRepository.save(testUser).getId();

        // When - A valid request is made to delete the user
        this.mockMvc.perform(delete("/api/user/"+testUserId).with(user("987654321@test.com")))

                // Then - The response should be OK and the user should be deleted
                .andExpect(status().isOk());
        assertThat(userRepository.findByEmail("987654321@test.com").isPresent()).isFalse();
    }

    @Test
    @DisplayName("When auth user requests delete NaN user, response is BadRequest")
    public void testDeleteNaNUserIsBadRequest() throws Exception {
        // When - A request is made to delete a user with an invalid ID format
        this.mockMvc.perform(delete("/api/user/1A7-2w").with(user("987654321@test.com")))

                // Then - The response should be BadRequest
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("When auth user requests get NaN user, response is BadRequest")
    public void testGetNaNUserIsBadRequest() throws Exception {
        // When - A request is made to get a user with an invalid ID format
        this.mockMvc.perform(get("/api/user/Aa1234!").with(user("987654321@test.com")))

                // Then - The response should be BadRequest
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("When auth user requests get nonExistant user, response is NotFound")
    public void testGetNullUserIsNotFound() throws Exception {
        // Given - A test user ID that does not exist
        long testUserId=userRepository.save(testUser).getId()+1;

        // When - A request is made to get a non-existent user
        this.mockMvc.perform(get("/api/user/"+testUserId).with(user("987654321@test.com")))

                // Then - The response should be NotFound
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("When auth user requests delete nonExistant user, response is NotFound")
    public void testDeleteNullUserIsNotFound() throws Exception {
        // Given - A test user ID that does not exist
        long testUserId=userRepository.save(testUser).getId()+1;

        // When - A request is made to delete a non-existent user
        this.mockMvc.perform(delete("/api/user/"+testUserId).with(user("987654321@test.com")))

                // Then - The response should be NotFound
                .andExpect(status().isNotFound());
    }
}