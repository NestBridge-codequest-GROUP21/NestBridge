package com.nestbridge.lodging;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LodgingPartnerRepository extends JpaRepository<LodgingPartner, UUID> {

    List<LodgingPartner> findByCityIgnoreCaseAndActiveTrue(String city);

    List<LodgingPartner> findByActiveTrue();
}
