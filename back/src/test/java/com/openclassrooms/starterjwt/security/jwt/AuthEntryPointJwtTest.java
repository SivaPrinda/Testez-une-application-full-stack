package com.openclassrooms.starterjwt.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.WriteListener;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthEntryPointJwtTest {

    @InjectMocks
    private AuthEntryPointJwt authEntryPointJwt;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private AuthenticationException authException;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private ByteArrayOutputStream byteArrayOutputStream;
    private ServletOutputStream servletOutputStream;

    @BeforeEach
    void setUp() throws IOException {
        // Mock request path and exception message
        when(request.getServletPath()).thenReturn("/api/test");
        when(authException.getMessage()).thenReturn("Unauthorized access");

        // Properly mock response output stream
        byteArrayOutputStream = new ByteArrayOutputStream();
        servletOutputStream = new ServletOutputStream() {
            @Override
            public void write(int b) {
                byteArrayOutputStream.write(b);
            }

            @Override
            public boolean isReady() {
                return true;
            }

            @Override
            public void setWriteListener(WriteListener writeListener) {
                // No-op for testing
            }
        };

        when(response.getOutputStream()).thenReturn(servletOutputStream);
    }

    @Test
    void commence_ShouldReturnUnauthorizedResponse() throws IOException, ServletException {
        // Ensure no exception is thrown during normal execution
        authEntryPointJwt.commence(request, response, authException);

        // Verify response properties
        verify(response).setContentType(MediaType.APPLICATION_JSON_VALUE);
        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        // Extract JSON response from mock output stream
        String jsonResponse = byteArrayOutputStream.toString();
        Map<String, Object> responseBody = objectMapper.readValue(jsonResponse, Map.class);

        assertThat(responseBody).containsEntry("status", 401);
        assertThat(responseBody).containsEntry("error", "Unauthorized");
        assertThat(responseBody).containsEntry("message", "Unauthorized access");
        assertThat(responseBody).containsEntry("path", "/api/test");
    }

    @Test
    void commence_ShouldThrowIOException_WhenResponseFails() throws IOException {
        // Arrange: Simulate failure in writing response
        when(response.getOutputStream()).thenThrow(new IOException("Response output error"));

        // Expect IOException instead of ServletException
        assertThrows(IOException.class, () -> authEntryPointJwt.commence(request, response, authException));

        // Verify that the response was still set to 401 Unauthorized
        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }

}
