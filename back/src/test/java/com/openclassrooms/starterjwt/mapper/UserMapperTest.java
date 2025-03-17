

package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class UserMapperTest {

    private UserMapper userMapper;

    @BeforeEach
    public void setUp() {
        userMapper = Mappers.getMapper(UserMapper.class);
    }

    @Test
    public void testToEntity_ShouldMapCorrectly() {
        UserDto dto = new UserDto();
        dto.setId(1L);
        dto.setFirstName("John");
        dto.setLastName("Doe");
        dto.setEmail("john.doe@example.com");
        dto.setPassword("password");

        User user = userMapper.toEntity(dto);

        assertNotNull(user);
        assertEquals(dto.getId(), user.getId());
        assertEquals(dto.getFirstName(), user.getFirstName());
        assertEquals(dto.getLastName(), user.getLastName());
        assertEquals(dto.getEmail(), user.getEmail());
    }

    @Test
    public void testToEntity_ShouldReturnNull_WhenDtoIsNull() {
        assertNull(userMapper.toEntity((UserDto) null));
    }

    @Test
    public void testToDto_ShouldMapCorrectly() {
        User user = new User();
        user.setId(1L);
        user.setFirstName("Jane");
        user.setLastName("Smith");
        user.setEmail("jane.smith@example.com");

        UserDto dto = userMapper.toDto(user);

        assertNotNull(dto);
        assertEquals(user.getId(), dto.getId());
        assertEquals(user.getFirstName(), dto.getFirstName());
        assertEquals(user.getLastName(), dto.getLastName());
        assertEquals(user.getEmail(), dto.getEmail());
    }

    @Test
    public void testToDto_ShouldReturnNull_WhenEntityIsNull() {
        assertNull(userMapper.toDto((User) null));
    }

    @Test
    public void testToEntityList_ShouldMapCorrectly() {
        UserDto dto1 = new UserDto(1L, "alice.brown@example.com",  "Brown","Alice",true,"alice123", LocalDateTime.parse("2024-08-20T21:33:08"),LocalDateTime.parse("2024-08-20T21:33:08"));
        UserDto dto2 = new UserDto(2L, "bob.white@example.com", "White", "Bob" ,false,"blanc123", LocalDateTime.parse("2024-08-20T21:33:08"),LocalDateTime.parse("2024-08-20T21:33:08"));

        List<User> users = userMapper.toEntity(Arrays.asList(dto1, dto2));

        assertEquals(2, users.size());
        assertEquals("Alice", users.get(0).getFirstName());
        assertEquals("Bob", users.get(1).getFirstName());
    }

    @Test
    public void testToDtoList_ShouldMapCorrectly() {
        User user1 = new User(1L, "charlie.green@example.com",  "Green","Charlie","vert123",true, LocalDateTime.parse("2024-08-20T21:33:08"),LocalDateTime.parse("2024-08-20T21:33:08"));
        User user2 = new User(2L, "dana.blue@example.com", "Blue", "Dana" ,"bleu123",false, LocalDateTime.parse("2024-08-20T21:33:08"),LocalDateTime.parse("2024-08-20T21:33:08"));

        List<UserDto> dtos = userMapper.toDto(Arrays.asList(user1, user2));

        assertEquals(2, dtos.size());
        assertEquals("Charlie", dtos.get(0).getFirstName());
        assertEquals("Dana", dtos.get(1).getFirstName());
    }
}