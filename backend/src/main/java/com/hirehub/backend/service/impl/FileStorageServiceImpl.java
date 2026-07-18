package com.hirehub.backend.service.impl;

import com.hirehub.backend.exception.BadRequestException;
import com.hirehub.backend.service.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation = Paths.get("./uploads").toAbsolutePath().normalize();

    public FileStorageServiceImpl() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new BadRequestException("Could not create the directory where the uploaded files will be stored.");
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subDirectory) {
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        if (originalFileName.contains("..")) {
            throw new BadRequestException("Filename contains invalid path sequence: " + originalFileName);
        }

        Path targetDir = this.fileStorageLocation.resolve(subDirectory).normalize();
        try {
            Files.createDirectories(targetDir);
        } catch (IOException e) {
            throw new BadRequestException("Could not create directory: " + targetDir);
        }

        String extension = "";
        int i = originalFileName.lastIndexOf('.');
        if (i > 0) {
            extension = originalFileName.substring(i);
        }
        
        String fileName = UUID.randomUUID().toString() + extension;
        Path targetLocation = targetDir.resolve(fileName);

        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return "uploads/" + subDirectory + "/" + fileName;
        } catch (IOException ex) {
            throw new BadRequestException("Could not store file " + originalFileName + ". Please try again!");
        }
    }
}
