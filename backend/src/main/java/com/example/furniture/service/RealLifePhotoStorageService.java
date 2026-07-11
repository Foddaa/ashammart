package com.example.furniture.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class RealLifePhotoStorageService {

    private final Path uploadDir = Paths.get("uploads/real-life-photos");

    public RealLifePhotoStorageService() throws IOException {
        Files.createDirectories(uploadDir);
    }

    public String store(MultipartFile file) throws IOException {
        String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + (ext != null ? "." + ext : "");
        Path target = uploadDir.resolve(fileName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }

    public void delete(String fileName) throws IOException {
        Files.deleteIfExists(uploadDir.resolve(fileName));
    }
}
