package com.shweta.lostfound_portal.controller;

import com.shweta.lostfound_portal.dto.CreateItemRequest;
import com.shweta.lostfound_portal.dto.ItemDTO;
import com.shweta.lostfound_portal.dto.MatchItemsRequest;
import com.shweta.lostfound_portal.dto.UpdateItemRequest;
import com.shweta.lostfound_portal.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
public class ItemController {
    
    @Autowired
    private ItemService itemService;
    
    /**
     * Get all lost items
     * GET /api/items/lost
     */
    @GetMapping("/items/lost")
    public ResponseEntity<List<ItemDTO>> getLostItems() {
        try {
            List<ItemDTO> items = itemService.getLostItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get all found items
     * GET /api/items/found
     */
    @GetMapping("/items/found")
    public ResponseEntity<List<ItemDTO>> getFoundItems() {
        try {
            List<ItemDTO> items = itemService.getFoundItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Search for items
     * GET /api/items/search?keyword=value
     */
    @GetMapping("/items/search")
    public ResponseEntity<List<ItemDTO>> searchItems(@RequestParam String keyword) {
        try {
            List<ItemDTO> items = itemService.searchItems(keyword);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get item by ID
     * GET /api/items/{id}
     */
    @GetMapping("/items/{id}")
    public ResponseEntity<ItemDTO> getItemById(@PathVariable Long id) {
        try {
            ItemDTO item = itemService.getItemById(id);
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Create a new item (Admin)
     * POST /api/admin/items
     */
    @PostMapping("/admin/items")
    public ResponseEntity<ItemDTO> createItem(@RequestBody CreateItemRequest request) {
        try {
            // Validate required fields
            if (request.getItemName() == null || request.getItemName().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            if (request.getLocation() == null || request.getLocation().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            if (request.getType() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            
            ItemDTO item = itemService.createItem(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(item);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Update an item (Admin)
     * PUT /api/admin/items/{id}
     */
    @PutMapping("/admin/items/{id}")
    public ResponseEntity<ItemDTO> updateItem(@PathVariable Long id, @RequestBody UpdateItemRequest request) {
        try {
            ItemDTO item = itemService.updateItem(id, request);
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Delete an item (Admin)
     * DELETE /api/admin/items/{id}
     */
    @DeleteMapping("/admin/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        try {
            itemService.deleteItem(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Match lost and found items (Admin)
     * PUT /api/admin/match-items
     */
    @PutMapping("/admin/match-items")
    public ResponseEntity<ItemDTO> matchItems(@RequestBody MatchItemsRequest request) {
        try {
            // Validate required fields
            if (request.getLostItemId() == null || request.getFoundItemId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            
            ItemDTO item = itemService.matchItems(request);
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

