package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.domain.dto.PhotoDto;
import com.example.travelmaprecodebe.domain.entity.Journey;
import com.example.travelmaprecodebe.domain.entity.Photo;
import com.example.travelmaprecodebe.photo.PhotoHandler;
import com.example.travelmaprecodebe.photo.PhotoProvider;
import com.example.travelmaprecodebe.photo.SimplePhotoHolder;
import com.example.travelmaprecodebe.repository.JourneyRepository;
import com.example.travelmaprecodebe.repository.PhotoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import static java.lang.Math.max;
import static javax.imageio.ImageIO.read;
import static javax.imageio.ImageIO.write;

@Slf4j
@Service
@RequiredArgsConstructor
public class PhotoService {
    @Value("${photo-service.resize:false}")
    public boolean useResize;

    static final int MAX_SIZE = 1080;

    private final PhotoProvider<String, SimplePhotoHolder> photoProvider;
    private final JourneyRepository journeyRepository;
    private final PhotoRepository photoRepository;
    private final PhotoHandler photoHandler;

    @Transactional
    public void save(Long saveJourneyId, List<MultipartFile> photos) throws IOException {
        Journey findJourney = journeyRepository.findById(saveJourneyId).orElse(null);

        List<Photo> photoList = photoHandler.parseFileInfo(photos);
        if(findJourney != null && !photoList.isEmpty()) {
            for (Photo photo : photoList) {
                photo.addJourney(findJourney);
                photoRepository.save(photo);
            }
        }
    }


    public byte[] load(String s) {
        return photoProvider.load(s).getData();
    }

    private byte[] tryResize(ByteArrayInputStream imageStream) throws IOException {
        BufferedImage originImage = read(imageStream);

        originImage = stripAlphaChannel(originImage);

        int width = originImage.getWidth();
        int height = originImage.getHeight();
        log.debug("업로드된 이미지 크기 ({}, {})", width, height);

        // 이미지 크기를 체크하고 제한보다 작을 경우 통과시킨다.
        if (max(width, height) < MAX_SIZE) {
            log.debug("업로드된 이미지가 제한 크기보다 작습니다. 압축을 하지 않습니다.");
            imageStream.reset();
            return imageStream.readAllBytes();
        }

        BufferedImage resizedImage = resize(originImage, MAX_SIZE);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        write(resizedImage, "jpg", outputStream);

        return outputStream.toByteArray();
    }

    /**
     * 알파 채널을 없애기 위해 배경색이 있는 {@code BufferedImage}을 생성하고, 주어진 {@code image}를 그 위에 덮어씁니다.<p>
     * See also  <a href=https://stackoverflow.com/a/60677340>스택 오버플로</a><p>
     *
     * @param image 이미지, PNG 혹은 JPG 인코딩일 수 있음
     * @return 알파 채널이 없어진 {@code BufferedImage}
     */
    BufferedImage stripAlphaChannel(BufferedImage image) {
        // NOTE: JPG일 경우 early return 하여 쓸모없는 CPU 파워를 아낄 수 있음.
        BufferedImage originImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
        originImage.createGraphics().drawImage(image, 0, 0, Color.WHITE, null);
        return originImage;
    }

    /**
     * <a href=https://mkyong.com/java/how-to-convert-bufferedimage-to-byte-in-java/>참조</a>
     * <a href=https://mkyong.com/java/how-to-convert-byte-to-bufferedimage-in-java/>참조</a>
     */
    @SuppressWarnings("SameParameterValue")
    BufferedImage resize(BufferedImage originalImage, int targetSize) {
        return Scalr.resize(originalImage, Scalr.Method.QUALITY, targetSize);
    }

    public PhotoDto findPhoto(Long photoId) {
        Photo entity = photoRepository.findById(photoId).orElseThrow(()
                -> new IllegalArgumentException("해당 파일이 존재하지 않습니다."));

        return PhotoDto.builder()
                .fullPath(entity.getFullPath())
                .build();


    }
}
