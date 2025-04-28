package com.huir.GmaoApp.model;

import java.time.DayOfWeek;
import java.time.Month;
import java.util.Map;

public class DateConstants {
    public static final Map<String, DayOfWeek> DAY_MAP = Map.of(
        "LUNDI", DayOfWeek.MONDAY,
        "MARDI", DayOfWeek.TUESDAY,
        "MERCREDI", DayOfWeek.WEDNESDAY,
        "JEUDI", DayOfWeek.THURSDAY,
        "VENDREDI", DayOfWeek.FRIDAY,
        "SAMEDI", DayOfWeek.SATURDAY,
        "DIMANCHE", DayOfWeek.SUNDAY
    );
    
    public static final Map<String, Month> MONTH_MAP = Map.of(
    );
}