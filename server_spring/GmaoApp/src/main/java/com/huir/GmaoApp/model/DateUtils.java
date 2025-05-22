package com.huir.GmaoApp.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;

public class DateUtils {
	 public static Date getLundiSemainePrecedente() {
	        Calendar cal = Calendar.getInstance();
	        cal.add(Calendar.WEEK_OF_YEAR, -1);
	        cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
	        return cal.getTime();
	    }

	    public static Date getDimancheSemainePrecedente() {
	        Calendar cal = Calendar.getInstance();
	        cal.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
	        return cal.getTime();
	    }

	    public static Date getPremierJourMois() {
	        Calendar cal = Calendar.getInstance();
	        cal.set(Calendar.DAY_OF_MONTH, 1);
	        return cal.getTime();
	    }
	    
	    public static Date getPremierJourMoisPrecedent() {
	        LocalDate now = LocalDate.now().withDayOfMonth(1);
	        LocalDate debut = now.minusMonths(1);
	        return Date.from(debut.atStartOfDay(ZoneId.systemDefault()).toInstant());
	    }

	    public static Date getDernierJourMoisPrecedent() {
	        LocalDate now = LocalDate.now().withDayOfMonth(1);
	        LocalDate fin = now.minusDays(1);
	        return Date.from(fin.atTime(LocalTime.MAX).atZone(ZoneId.systemDefault()).toInstant());
	    }

}
