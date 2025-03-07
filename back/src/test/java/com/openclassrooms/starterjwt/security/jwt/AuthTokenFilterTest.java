package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.lang.reflect.Method;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthTokenFilterTest {

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private AuthTokenFilter authTokenFilter;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private FilterChain filterChain;

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        filterChain = new MockFilterChain();
        //  Reset SecurityContextHolder before each test
        SecurityContextHolder.clearContext();
    }

    @Test
    void doFilterInternal_ShouldAuthenticateUser_WhenJwtIsValid() throws ServletException, IOException {
        // Arrange
        String token = "valid-jwt-token";
        String username = "testuser";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtUtils.validateJwtToken(token)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(token)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        when(userDetails.getAuthorities()).thenReturn(null); // No roles needed for this test

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        UsernamePasswordAuthenticationToken authentication =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        assertThat(authentication).isNotNull();
        assertThat(authentication.getPrincipal()).isEqualTo(userDetails);
        verify(jwtUtils, times(1)).validateJwtToken(token);
        verify(jwtUtils, times(1)).getUserNameFromJwtToken(token);
        verify(userDetailsService, times(1)).loadUserByUsername(username);
    }

    @Test
    void doFilterInternal_ShouldNotAuthenticateUser_WhenJwtIsInvalid() throws ServletException, IOException {
        // Arrange
        String token = "invalid-jwt-token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtUtils.validateJwtToken(token)).thenReturn(false);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(jwtUtils, times(1)).validateJwtToken(token);
        verify(jwtUtils, never()).getUserNameFromJwtToken(anyString());
        verify(userDetailsService, never()).loadUserByUsername(anyString());
    }

    @Test
    void doFilterInternal_ShouldNotAuthenticateUser_WhenNoJwtIsProvided() throws ServletException, IOException {
        // Arrange
        request.addHeader("Authorization", "");

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verifyNoInteractions(jwtUtils);
        verifyNoInteractions(userDetailsService);
    }

    @Test
    void parseJwt_ShouldReturnToken_WhenValidAuthorizationHeaderIsProvided() throws Exception {
        // Arrange
        request.addHeader("Authorization", "Bearer valid-jwt-token");

        // Use Reflection to access the private method
        Method parseJwtMethod = AuthTokenFilter.class.getDeclaredMethod("parseJwt", HttpServletRequest.class);
        parseJwtMethod.setAccessible(true); // Allow access to private method

        // Act
        String token = (String) parseJwtMethod.invoke(authTokenFilter, request);

        // Assert
        assertThat(token).isEqualTo("valid-jwt-token");
    }

    @Test
    void parseJwt_ShouldReturnNull_WhenAuthorizationHeaderIsMissing() throws Exception {
        // Use Reflection to access the private method
        Method parseJwtMethod = AuthTokenFilter.class.getDeclaredMethod("parseJwt", HttpServletRequest.class);
        parseJwtMethod.setAccessible(true); // Allow access to private method

        // Act
        String token = (String) parseJwtMethod.invoke(authTokenFilter, request);

        // Assert
        assertThat(token).isNull();
    }

    @Test
    void parseJwt_ShouldReturnNull_WhenAuthorizationHeaderIsMalformed() throws Exception {
        // Arrange
        request.addHeader("Authorization", "InvalidHeader");

        // Use Reflection to access the private method
        Method parseJwtMethod = AuthTokenFilter.class.getDeclaredMethod("parseJwt", HttpServletRequest.class);
        parseJwtMethod.setAccessible(true); // Allow access to private method

        // Act
        String token = (String) parseJwtMethod.invoke(authTokenFilter, request);

        // Assert
        assertThat(token).isNull();
    }
}
