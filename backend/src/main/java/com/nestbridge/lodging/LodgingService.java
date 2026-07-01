package com.nestbridge.lodging;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LodgingService {

    private final LodgingPartnerRepository lodgingPartnerRepository;

    @Transactional(readOnly = true)
    public List<LodgingPartnerDto> getPartners(String city) {
        List<LodgingPartner> partners = city != null && !city.isBlank()
                ? lodgingPartnerRepository.findByCityIgnoreCaseAndActiveTrue(city)
                : lodgingPartnerRepository.findByActiveTrue();
        return partners.stream().map(this::toDto).collect(Collectors.toList());
    }

    private LodgingPartnerDto toDto(LodgingPartner p) {
        return LodgingPartnerDto.builder()
                .partnerId(p.getPartnerId())
                .name(p.getName())
                .city(p.getCity())
                .category(p.getCategory())
                .address(p.getAddress())
                .phone(p.getPhone())
                .email(p.getEmail())
                .websiteUrl(p.getWebsiteUrl())
                .bookingUrl(p.getBookingUrl())
                .priceFrom(p.getPriceFrom())
                .currency(p.getCurrency())
                .description(p.getDescription())
                .build();
    }
}
