package com.example.travelmaprecodebe.photo;

import com.example.travelmaprecodebe.domain.dto.PhotoDto;
import com.example.travelmaprecodebe.domain.entity.Photo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class PhotoHandler {

    // Local, Dev 경로 다름.
    @Value("${image.path}")
    private String imagePath;

    public List<Photo> parseFileInfo(List<MultipartFile> multipartFiles) throws IOException {
        // 반환할 파일 리스트
        List<Photo> fileList = new ArrayList<>();

        // 전달되어 온 파일이 존재할 경우
        if (!CollectionUtils.isEmpty(multipartFiles)) {
            // 파일명을 업로드 한 날짜로 변환하여 저장
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
            String current_date = now.format(dateTimeFormatter);

            // 프로젝트 디렉터리 내의 저장을 위한 절대 경로 설정
            // 경로 구분자 File.separator 사용
            String absolutePath = new File("").getAbsolutePath() + File.separator;

            // 파일을 저장할 세부 경로 지정
            String path = imagePath + File.separator + current_date;
            File file = new File(path);

            // 디렉터리가 존재하지 않을 경우
            if (!file.exists()) {
                boolean wasSuccessful = file.mkdirs();

                // 디렉터리 생성에 실패했을 경우
                if (!wasSuccessful)
                    log.error("file: was not successful");
            }

            // 다중 파일 처리
            for (MultipartFile multipartFile : multipartFiles) {

                // 파일의 확장자 추출
                String originalFileExtension;
                String contentType = multipartFile.getContentType();

                byte[] imageBytes = multipartFile.getBytes();
                ByteArrayInputStream  bis = new ByteArrayInputStream(imageBytes);
                BufferedImage image = ImageIO.read(bis);
                int actualWidth = image.getWidth();
                int actualHeight = image.getHeight();

                // 확장자명이 존재하지 않을 경우 처리 x
                if (ObjectUtils.isEmpty(contentType)) {
                    break;
                } else {  // 확장자가 jpeg, png인 파일들만 받아서 처리
                    if (contentType.contains("image/jpeg")){
                        originalFileExtension = ".jpg";
                    } else if (contentType.contains("image/png")){
                        originalFileExtension = ".png";
                    } else {
                        break;
                    }
                }

                // 파일명 중복 피하고자 UUID사용.
                String fileName = UUID.randomUUID().toString();

                PhotoDto photoDto = PhotoDto.builder()
                        .originFileName(multipartFile.getOriginalFilename())
                        .fileName(fileName)
                        .fullPath(path + File.separator + fileName + originalFileExtension)
                        .width(actualWidth)
                        .height(actualHeight)
                        .fileSize(multipartFile.getSize())
                        .build();

                Photo photo = photoDto.toEntity();

                // 생성 후 리스트에 추가
                fileList.add(photo);

                // 업로드 한 파일 데이터를 지정한 파일에 저장
                file = new File(absolutePath + path + File.separator + fileName + originalFileExtension);
                try {
                    multipartFile.transferTo(file);
                } catch (Exception e) {
                    // todo
                    log.error("transferTo error");
                }

            }
        }

        return fileList;
    }
}