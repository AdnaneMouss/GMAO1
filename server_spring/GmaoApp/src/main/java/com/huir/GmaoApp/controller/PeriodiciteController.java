import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.huir.GmaoApp.model.Periodicite;
import com.huir.GmaoApp.service.PeriodiciteService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/periodicites")
public class PeriodiciteController {

    @Autowired
    private PeriodiciteService periodiciteService;

  

  
 
   
}
