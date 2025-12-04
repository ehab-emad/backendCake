"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flight = void 0;
/**
 * كيان يمثل رحلة طيران
 * @property {string} id - المعرف الفريد للرحلة
 * @property {string} status - حالة الرحلة (مثلاً: "مجدولة"، "ملغاة"، إلخ)
 * @property {string} airlineId - معرف شركة الطيران
 * @property {string} clientId - معرف العميل
 * @property {string} departureCity - مدينة المغادرة
 * @property {string} arrivalCity - مدينة الوصول
 * @property {string} flightNumber - رقم الرحلة
 * @property {number} numberOfStops - عدد التوقفات (افتراضي: 0)
 * @property {string | null} gate - بوابة المغادرة (اختياري)
 * @property {Date} flightDate - تاريخ الرحلة
 * @property {Date} returnDate - تاريخ العودة
 * @property {string} departureTime - وقت المغادرة
 * @property {string} arrivalTime - وقت الوصول
 * @property {number} flightDuration - مدة الرحلة (بالدقائق)
 * @property {number} availableSeats - عدد المقاعد المتاحة
 * @property {string} bookingClass - فئة الحجز (مثل: اقتصادية، رجال الأعمال، الدرجة الأولى)
 * @property {string} inFlightEntertainment - وصف الترفيه على متن الطائرة
 * @property {string} usbPortOutlet - وصف منافذ USB المتاحة
 * @property {number} price - سعر التذكرة
 * @property {number} discount - نسبة الخصم (0-100)
 * @property {string} aircraftType - نوع الطائرة
 * @property {string} seatLayout - تخطيط المقاعد
 * @property {string} seatPitch - مسافة المقاعد
 * @property {string | null} aircraftImage - رابط صورة الطائرة (اختياري)
 * @property {FlightBaggage[]} baggage - الأمتعة المسموح بها
 * @property {FlightAmenity[]} amenities - المرافق المتوفرة
 * @property {FlightMeal[]} meals - الوجبات المتوفرة
 * @property {FlightRating[]} ratings - التقييمات
 * @property {Flight[]} transitFlights - الرحلات الترانزيت (الرحلات المتوسطة)
 * @property {Flight[]} returnFlights - رحلات العودة
 */
class Flight {
    // Calculates available seats based on seats array where isBooking is false
    get availableSeats() {
        return this.seats.filter(seat => seat.isBooking === false).length;
    }
    // Keeps track of the total number of seats (read-only)
    get allSeats() {
        return this.seats.length;
    }
    constructor(id, status = true, airlineId, clientId, name = '', rating = 0, departureCity, arrivalCity, flightNumber = null, numberOfStops = 0, gate = null, flightDate, currency = 'AED', returnDate, departureTime, arrivalTime, flightDuration, 
    // availableSeats is now a computed property
    bookingClass, inFlightEntertainment, usbPortOutlet, aircraftType, price = null, discount = null, seatLayout = null, seatPitch = null, aircraftImage = null, rest = null, transit = false, departureIata = null, arrivalIata = null, isSuggested = false, baggage = [], amenities = [], flightMeals = [], ratings = [], transitFlights = [], returnFlights = [], meals = [], unlimitedInternet = [], airportTransfer = [], extraBaggage = [], seats = [], createdAt, updatedAt) {
        this.id = id;
        this.status = status;
        this.airlineId = airlineId;
        this.clientId = clientId;
        this.name = name;
        this.rating = rating;
        this.departureCity = departureCity;
        this.arrivalCity = arrivalCity;
        this.flightNumber = flightNumber;
        this.numberOfStops = numberOfStops;
        this.gate = gate;
        this.flightDate = flightDate;
        this.currency = currency;
        this.returnDate = returnDate;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.flightDuration = flightDuration;
        this.bookingClass = bookingClass;
        this.inFlightEntertainment = inFlightEntertainment;
        this.usbPortOutlet = usbPortOutlet;
        this.aircraftType = aircraftType;
        this.price = price;
        this.discount = discount;
        this.seatLayout = seatLayout;
        this.seatPitch = seatPitch;
        this.aircraftImage = aircraftImage;
        this.rest = rest;
        this.transit = transit;
        this.departureIata = departureIata;
        this.arrivalIata = arrivalIata;
        this.isSuggested = isSuggested;
        this.baggage = baggage;
        this.amenities = amenities;
        this.flightMeals = flightMeals;
        this.ratings = ratings;
        this.transitFlights = transitFlights;
        this.returnFlights = returnFlights;
        this.meals = meals;
        this.unlimitedInternet = unlimitedInternet;
        this.airportTransfer = airportTransfer;
        this.extraBaggage = extraBaggage;
        this.seats = seats;
        // Initialize arrays if not provided
        this.baggage = baggage || [];
        this.amenities = amenities || [];
        this.flightMeals = flightMeals || [];
        this.ratings = ratings || [];
        this.meals = meals || [];
        this.unlimitedInternet = this.unlimitedInternet || [];
        this.airportTransfer = this.airportTransfer || [];
        this.extraBaggage = this.extraBaggage || [];
        // Initialize seats array and set availableSeats
        this.seats = seats || [];
        // Initialize transit flights array
        this.transitFlights = transitFlights || [];
        // Initialize return flights array
        this.returnFlights = returnFlights || [];
        // Initialize timestamps
        const now = new Date();
        this.createdAt = createdAt || now;
        this.updatedAt = updatedAt || now;
    }
}
exports.Flight = Flight;
