package com.shweta.lostfound_portal.controller;

import com.shweta.lostfound_portal.dto.CreateItemRequest;
import com.shweta.lostfound_portal.dto.ItemDTO;
import com.shweta.lostfound_portal.service.ItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shweta.lostfound_portal.enums.ItemStatus;
import com.shweta.lostfound_portal.enums.ItemType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebMvcTest(ItemController.class)
public class ItemControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private ItemService itemService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private ItemDTO itemDTO;
    
    @BeforeEach
    public void setUp() {
        itemDTO = new ItemDTO();
        itemDTO.setId(1L);
        itemDTO.setType(ItemType.LOST);
        itemDTO.setItemName("Test Keys");
        itemDTO.setDescription("Test Description");
        itemDTO.setLocation("Library");
        itemDTO.setStatus(ItemStatus.LOST);
        itemDTO.setCreatedAt(LocalDateTime.now());
    }
    
    @Test
    public void testGetLostItems() throws Exception {
        List<ItemDTO> items = new ArrayList<>();
        items.add(itemDTO);
        
        when(itemService.getLostItems()).thenReturn(items);
        
        mockMvc.perform(get("/api/items/lost"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].itemName", is("Test Keys")));
    }
    
    @Test
    public void testGetFoundItems() throws Exception {
        itemDTO.setType(ItemType.FOUND);
        itemDTO.setFoundBy("Security");
        
        List<ItemDTO> items = new ArrayList<>();
        items.add(itemDTO);
        
        when(itemService.getFoundItems()).thenReturn(items);
        
        mockMvc.perform(get("/api/items/found"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].foundBy", is("Security")));
    }
    
    @Test
    public void testSearchItems() throws Exception {
        List<ItemDTO> items = new ArrayList<>();
        items.add(itemDTO);
        
        when(itemService.searchItems("keys")).thenReturn(items);
        
        mockMvc.perform(get("/api/items/search?keyword=keys"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }
    
    @Test
    public void testCreateItem() throws Exception {
        CreateItemRequest request = new CreateItemRequest();
        request.setType(ItemType.LOST);
        request.setItemName("Test Keys");
        request.setDescription("Test Description");
        request.setLocation("Library");
        request.setStudentName("John Doe");
        request.setStudentNumber("STU001");
        request.setStatus(ItemStatus.LOST);
        
        when(itemService.createItem(any(CreateItemRequest.class))).thenReturn(itemDTO);
        
        mockMvc.perform(post("/api/admin/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.itemName", is("Test Keys")));
    }
    
    @Test
    public void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")));
    }
}

