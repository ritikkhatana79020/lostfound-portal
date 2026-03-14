package com.shweta.lostfound_portal.service;

import com.shweta.lostfound_portal.dto.CreateItemRequest;
import com.shweta.lostfound_portal.dto.ItemDTO;
import com.shweta.lostfound_portal.dto.MatchItemsRequest;
import com.shweta.lostfound_portal.dto.UpdateItemRequest;
import com.shweta.lostfound_portal.enums.ItemStatus;
import com.shweta.lostfound_portal.enums.ItemType;
import com.shweta.lostfound_portal.model.Item;
import com.shweta.lostfound_portal.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {
    
    @Autowired
    private ItemRepository itemRepository;
    
    /**
     * Get all lost items
     */
    public List<ItemDTO> getLostItems() {
        return itemRepository.findByType(ItemType.LOST)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all found items
     */
    public List<ItemDTO> getFoundItems() {
        return itemRepository.findByType(ItemType.FOUND)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Search for items by keyword
     */
    public List<ItemDTO> searchItems(String keyword) {
        return itemRepository.searchAllItems(keyword)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Search for lost items by keyword
     */
    public List<ItemDTO> searchLostItems(String keyword) {
        return itemRepository.searchItems(ItemType.LOST, keyword)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Search for found items by keyword
     */
    public List<ItemDTO> searchFoundItems(String keyword) {
        return itemRepository.searchItems(ItemType.FOUND, keyword)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Create a new item (Admin)
     */
    public ItemDTO createItem(CreateItemRequest request) {
        Item item = new Item();
        item.setType(request.getType());
        item.setItemName(request.getItemName());
        item.setDescription(request.getDescription());
        item.setLocation(request.getLocation());
        item.setPhotoUrl(request.getPhotoUrl());
        item.setPhotoPath(request.getPhotoPath());
        item.setStudentName(request.getStudentName());
        item.setStudentNumber(request.getStudentNumber());
        item.setFoundBy(request.getFoundBy());
        item.setStatus(request.getStatus() != null ? request.getStatus() : ItemStatus.NOT_CLAIMED);
        item.setDateReported(LocalDateTime.now());
        
        Item savedItem = itemRepository.save(item);
        return convertToDTO(savedItem);
    }
    
    /**
     * Update an item (Admin)
     */
    public ItemDTO updateItem(Long id, UpdateItemRequest request) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        
        if (request.getDescription() != null) {
            item.setDescription(request.getDescription());
        }
        if (request.getLocation() != null) {
            item.setLocation(request.getLocation());
        }
        if (request.getPhotoUrl() != null) {
            item.setPhotoUrl(request.getPhotoUrl());
        }
        if (request.getPhotoPath() != null) {
            item.setPhotoPath(request.getPhotoPath());
        }
        if (request.getStatus() != null) {
            item.setStatus(request.getStatus());
        }
        if (request.getStudentName() != null) {
            item.setStudentName(request.getStudentName());
        }
        if (request.getStudentNumber() != null) {
            item.setStudentNumber(request.getStudentNumber());
        }
        
        Item updatedItem = itemRepository.save(item);
        return convertToDTO(updatedItem);
    }
    
    /**
     * Get item by ID
     */
    public ItemDTO getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        return convertToDTO(item);
    }
    
    /**
     * Delete an item (Admin)
     */
    public void deleteItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        itemRepository.delete(item);
    }
    
    /**
     * Match a lost item with a found item (Admin)
     */
    public ItemDTO matchItems(MatchItemsRequest request) {
        Item lostItem = itemRepository.findById(request.getLostItemId())
                .orElseThrow(() -> new RuntimeException("Lost item not found with id: " + request.getLostItemId()));
        
        Item foundItem = itemRepository.findById(request.getFoundItemId())
                .orElseThrow(() -> new RuntimeException("Found item not found with id: " + request.getFoundItemId()));
        
        if (lostItem.getType() != ItemType.LOST) {
            throw new RuntimeException("Item with id " + request.getLostItemId() + " is not a lost item");
        }
        
        if (foundItem.getType() != ItemType.FOUND) {
            throw new RuntimeException("Item with id " + request.getFoundItemId() + " is not a found item");
        }
        
        // Link the items
        lostItem.setMatchedWith(foundItem.getId());
        foundItem.setMatchedWith(lostItem.getId());
        
        itemRepository.save(lostItem);
        itemRepository.save(foundItem);
        
        return convertToDTO(lostItem);
    }
    
    /**
     * Convert Item entity to ItemDTO
     */
    private ItemDTO convertToDTO(Item item) {
        ItemDTO dto = new ItemDTO();
        dto.setId(item.getId());
        dto.setType(item.getType());
        dto.setItemName(item.getItemName());
        dto.setDescription(item.getDescription());
        dto.setLocation(item.getLocation());
        dto.setPhotoUrl(item.getPhotoUrl());
        dto.setPhotoPath(item.getPhotoPath());
        dto.setStudentName(item.getStudentName());
        dto.setStudentNumber(item.getStudentNumber());
        dto.setFoundBy(item.getFoundBy());
        dto.setStatus(item.getStatus());
        dto.setDateReported(item.getDateReported());
        dto.setDateFound(item.getDateFound());
        dto.setMatchedWith(item.getMatchedWith());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        return dto;
    }
}

