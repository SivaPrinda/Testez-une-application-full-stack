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
        // Given - A request with a path and an unauthorized access exception
        when(request.getServletPath()).thenReturn("/api/test");
        when(authException.getMessage()).thenReturn("Unauthorized access");

        // Given - Mock the response output stream for JSON response testing
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
        // When - The commence method is called
        authEntryPointJwt.commence(request, response, authException);

        // Then - The response should have a 401 status and contain the correct error details
        verify(response).setContentType(MediaType.APPLICATION_JSON_VALUE);
        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String jsonResponse = byteArrayOutputStream.toString();
        Map<String, Object> responseBody = objectMapper.readValue(jsonResponse, Map.class);

        assertThat(responseBody).containsEntry("status", 401);
        assertThat(responseBody).containsEntry("error", "Unauthorized");
        assertThat(responseBody).containsEntry("message", "Unauthorized access");
        assertThat(responseBody).containsEntry("path", "/api/test");
    }

    @Test
    void commence_ShouldThrowIOException_WhenResponseFails() throws IOException {
        // Given - The response output stream throws an IOException
        when(response.getOutputStream()).thenThrow(new IOException("Response output error"));

        // When - The commence method is called
        assertThrows(IOException.class, () -> authEntryPointJwt.commence(request, response, authException));

        // Then - An IOException should be thrown and the response status should be 401
        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }

}
