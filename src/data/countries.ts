export interface Country {
  iso2: string;
  isoNumeric: string;
  namePl: string;
  nameEn: string;
  capital: string;
  continent: 'Europa' | 'Azja' | 'Afryka' | 'Ameryka Północna' | 'Ameryka Południowa' | 'Oceania';
  neighbors: string[];
  difficultyWeight: number;
}

export const COUNTRIES_DATA: Country[] = [
  {
    "iso2": "PL",
    "isoNumeric": "616",
    "namePl": "Polska",
    "nameEn": "Poland",
    "capital": "Warszawa",
    "continent": "Europa",
    "neighbors": [
      "DE",
      "CZ",
      "SK",
      "UA",
      "BY",
      "LT",
      "RU"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "DE",
    "isoNumeric": "276",
    "namePl": "Niemcy",
    "nameEn": "Germany",
    "capital": "Berlin",
    "continent": "Europa",
    "neighbors": [
      "PL",
      "CZ",
      "AT",
      "CH",
      "FR",
      "LU",
      "BE",
      "NL",
      "DK"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "FR",
    "isoNumeric": "250",
    "namePl": "Francja",
    "nameEn": "France",
    "capital": "Paryż",
    "continent": "Europa",
    "neighbors": [
      "BE",
      "LU",
      "DE",
      "CH",
      "IT",
      "MC",
      "ES",
      "AD"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "IT",
    "isoNumeric": "380",
    "namePl": "Włochy",
    "nameEn": "Italy",
    "capital": "Rzym",
    "continent": "Europa",
    "neighbors": [
      "FR",
      "CH",
      "AT",
      "SI",
      "SM",
      "VA"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "ES",
    "isoNumeric": "724",
    "namePl": "Hiszpania",
    "nameEn": "Spain",
    "capital": "Madryt",
    "continent": "Europa",
    "neighbors": [
      "PT",
      "FR",
      "AD",
      "MA"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "PT",
    "isoNumeric": "620",
    "namePl": "Portugalia",
    "nameEn": "Portugal",
    "capital": "Lizbona",
    "continent": "Europa",
    "neighbors": [
      "ES"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "GB",
    "isoNumeric": "826",
    "namePl": "Wielka Brytania",
    "nameEn": "United Kingdom",
    "capital": "Londyn",
    "continent": "Europa",
    "neighbors": [
      "IE"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "IE",
    "isoNumeric": "372",
    "namePl": "Irlandia",
    "nameEn": "Ireland",
    "capital": "Dublin",
    "continent": "Europa",
    "neighbors": [
      "GB"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "NL",
    "isoNumeric": "528",
    "namePl": "Holandia",
    "nameEn": "Netherlands",
    "capital": "Amsterdam",
    "continent": "Europa",
    "neighbors": [
      "DE",
      "BE"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "BE",
    "isoNumeric": "056",
    "namePl": "Belgia",
    "nameEn": "Belgium",
    "capital": "Bruksela",
    "continent": "Europa",
    "neighbors": [
      "FR",
      "LU",
      "DE",
      "NL"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "LU",
    "isoNumeric": "442",
    "namePl": "Luksemburg",
    "nameEn": "Luxembourg",
    "capital": "Luksemburg",
    "continent": "Europa",
    "neighbors": [
      "BE",
      "DE",
      "FR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "CH",
    "isoNumeric": "756",
    "namePl": "Szwajcaria",
    "nameEn": "Switzerland",
    "capital": "Berno",
    "continent": "Europa",
    "neighbors": [
      "FR",
      "DE",
      "AT",
      "LI",
      "IT"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "AT",
    "isoNumeric": "040",
    "namePl": "Austria",
    "nameEn": "Austria",
    "capital": "Wiedeń",
    "continent": "Europa",
    "neighbors": [
      "DE",
      "CZ",
      "SK",
      "HU",
      "SI",
      "IT",
      "CH",
      "LI"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "CZ",
    "isoNumeric": "203",
    "namePl": "Czechy",
    "nameEn": "Czechia",
    "capital": "Praga",
    "continent": "Europa",
    "neighbors": [
      "DE",
      "PL",
      "SK",
      "AT"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "SK",
    "isoNumeric": "703",
    "namePl": "Słowacja",
    "nameEn": "Slovakia",
    "capital": "Bratysława",
    "continent": "Europa",
    "neighbors": [
      "CZ",
      "PL",
      "UA",
      "HU",
      "AT"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "HU",
    "isoNumeric": "348",
    "namePl": "Węgry",
    "nameEn": "Hungary",
    "capital": "Budapeszt",
    "continent": "Europa",
    "neighbors": [
      "SK",
      "UA",
      "RO",
      "RS",
      "HR",
      "SI",
      "AT"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "UA",
    "isoNumeric": "804",
    "namePl": "Ukraina",
    "nameEn": "Ukraine",
    "capital": "Kijów",
    "continent": "Europa",
    "neighbors": [
      "RU",
      "BY",
      "PL",
      "SK",
      "HU",
      "RO",
      "MD"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "BY",
    "isoNumeric": "112",
    "namePl": "Białoruś",
    "nameEn": "Belarus",
    "capital": "Mińsk",
    "continent": "Europa",
    "neighbors": [
      "RU",
      "UA",
      "PL",
      "LT",
      "LV"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "LT",
    "isoNumeric": "440",
    "namePl": "Litwa",
    "nameEn": "Lithuania",
    "capital": "Wilno",
    "continent": "Europa",
    "neighbors": [
      "LV",
      "BY",
      "PL",
      "RU"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "LV",
    "isoNumeric": "428",
    "namePl": "Łotwa",
    "nameEn": "Latvia",
    "capital": "Ryga",
    "continent": "Europa",
    "neighbors": [
      "EE",
      "RU",
      "BY",
      "LT"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "EE",
    "isoNumeric": "233",
    "namePl": "Estonia",
    "nameEn": "Estonia",
    "capital": "Tallinn",
    "continent": "Europa",
    "neighbors": [
      "RU",
      "LV"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "RO",
    "isoNumeric": "642",
    "namePl": "Rumunia",
    "nameEn": "Romania",
    "capital": "Bukareszt",
    "continent": "Europa",
    "neighbors": [
      "UA",
      "MD",
      "BG",
      "RS",
      "HU"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "BG",
    "isoNumeric": "100",
    "namePl": "Bułgaria",
    "nameEn": "Bulgaria",
    "capital": "Sofia",
    "continent": "Europa",
    "neighbors": [
      "RO",
      "RS",
      "MK",
      "GR",
      "TR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "GR",
    "isoNumeric": "300",
    "namePl": "Grecja",
    "nameEn": "Greece",
    "capital": "Ateny",
    "continent": "Europa",
    "neighbors": [
      "AL",
      "MK",
      "BG",
      "TR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "RS",
    "isoNumeric": "688",
    "namePl": "Serbia",
    "nameEn": "Serbia",
    "capital": "Belgrad",
    "continent": "Europa",
    "neighbors": [
      "HU",
      "RO",
      "BG",
      "MK",
      "XK",
      "ME",
      "BA",
      "HR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "HR",
    "isoNumeric": "191",
    "namePl": "Chorwacja",
    "nameEn": "Croatia",
    "capital": "Zagrzeb",
    "continent": "Europa",
    "neighbors": [
      "SI",
      "HU",
      "RS",
      "BA",
      "ME"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "SI",
    "isoNumeric": "705",
    "namePl": "Słowenia",
    "nameEn": "Slovenia",
    "capital": "Lublana",
    "continent": "Europa",
    "neighbors": [
      "IT",
      "AT",
      "HU",
      "HR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "BA",
    "isoNumeric": "070",
    "namePl": "Bośnia i Hercegowina",
    "nameEn": "Bosnia and Herzegovina",
    "capital": "Sarajewo",
    "continent": "Europa",
    "neighbors": [
      "HR",
      "RS",
      "ME"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "ME",
    "isoNumeric": "499",
    "namePl": "Czarnogóra",
    "nameEn": "Montenegro",
    "capital": "Podgorica",
    "continent": "Europa",
    "neighbors": [
      "BA",
      "RS",
      "XK",
      "AL"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "MK",
    "isoNumeric": "807",
    "namePl": "Macedonia Północna",
    "nameEn": "North Macedonia",
    "capital": "Skopje",
    "continent": "Europa",
    "neighbors": [
      "XK",
      "RS",
      "BG",
      "GR",
      "AL"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "AL",
    "isoNumeric": "008",
    "namePl": "Albania",
    "nameEn": "Albania",
    "capital": "Tirana",
    "continent": "Europa",
    "neighbors": [
      "ME",
      "XK",
      "MK",
      "GR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "XK",
    "isoNumeric": "383",
    "namePl": "Kosowo",
    "nameEn": "Kosovo",
    "capital": "Prisztina",
    "continent": "Europa",
    "neighbors": [
      "RS",
      "MK",
      "AL",
      "ME"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "SE",
    "isoNumeric": "752",
    "namePl": "Szwecja",
    "nameEn": "Sweden",
    "capital": "Sztokholm",
    "continent": "Europa",
    "neighbors": [
      "NO",
      "FI"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "NO",
    "isoNumeric": "578",
    "namePl": "Norwegia",
    "nameEn": "Norway",
    "capital": "Oslo",
    "continent": "Europa",
    "neighbors": [
      "SE",
      "FI",
      "RU"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "FI",
    "isoNumeric": "246",
    "namePl": "Finlandia",
    "nameEn": "Finland",
    "capital": "Helsinki",
    "continent": "Europa",
    "neighbors": [
      "SE",
      "NO",
      "RU"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "DK",
    "isoNumeric": "208",
    "namePl": "Dania",
    "nameEn": "Denmark",
    "capital": "Kopenhaga",
    "continent": "Europa",
    "neighbors": [
      "DE"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "IS",
    "isoNumeric": "352",
    "namePl": "Islandia",
    "nameEn": "Iceland",
    "capital": "Reykjavík",
    "continent": "Europa",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "MD",
    "isoNumeric": "498",
    "namePl": "Mołdawia",
    "nameEn": "Moldova",
    "capital": "Kiszyniów",
    "continent": "Europa",
    "neighbors": [
      "RO",
      "UA"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "MT",
    "isoNumeric": "470",
    "namePl": "Malta",
    "nameEn": "Malta",
    "capital": "Valletta",
    "continent": "Europa",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "CY",
    "isoNumeric": "196",
    "namePl": "Cypr",
    "nameEn": "Cyprus",
    "capital": "Nikozja",
    "continent": "Europa",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "LI",
    "isoNumeric": "438",
    "namePl": "Liechtenstein",
    "nameEn": "Liechtenstein",
    "capital": "Vaduz",
    "continent": "Europa",
    "neighbors": [
      "CH",
      "AT"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "MC",
    "isoNumeric": "492",
    "namePl": "Monako",
    "nameEn": "Monaco",
    "capital": "Monako",
    "continent": "Europa",
    "neighbors": [
      "FR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "AD",
    "isoNumeric": "020",
    "namePl": "Andora",
    "nameEn": "Andorra",
    "capital": "Andora",
    "continent": "Europa",
    "neighbors": [
      "FR",
      "ES"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "SM",
    "isoNumeric": "674",
    "namePl": "San Marino",
    "nameEn": "San Marino",
    "capital": "San Marino",
    "continent": "Europa",
    "neighbors": [
      "IT"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "VA",
    "isoNumeric": "336",
    "namePl": "Watykan",
    "nameEn": "Vatican City",
    "capital": "Watykan",
    "continent": "Europa",
    "neighbors": [
      "IT"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "CN",
    "isoNumeric": "156",
    "namePl": "Chiny",
    "nameEn": "China",
    "capital": "Pekin",
    "continent": "Azja",
    "neighbors": [
      "MN",
      "RU",
      "KP",
      "VN",
      "LA",
      "MM",
      "IN",
      "BT",
      "NP",
      "PK",
      "AF",
      "TJ",
      "KG",
      "KZ"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "JP",
    "isoNumeric": "392",
    "namePl": "Japonia",
    "nameEn": "Japan",
    "capital": "Tokio",
    "continent": "Azja",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "IN",
    "isoNumeric": "356",
    "namePl": "Indie",
    "nameEn": "India",
    "capital": "Nowe Delhi",
    "continent": "Azja",
    "neighbors": [
      "PK",
      "CN",
      "NP",
      "BT",
      "BD",
      "MM"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "ID",
    "isoNumeric": "360",
    "namePl": "Indonezja",
    "nameEn": "Indonesia",
    "capital": "Dżakarta",
    "continent": "Azja",
    "neighbors": [
      "MY",
      "PG",
      "TL"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "PK",
    "isoNumeric": "586",
    "namePl": "Pakistan",
    "nameEn": "Pakistan",
    "capital": "Islamabad",
    "continent": "Azja",
    "neighbors": [
      "IR",
      "AF",
      "CN",
      "IN"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "BD",
    "isoNumeric": "050",
    "namePl": "Bangladesz",
    "nameEn": "Bangladesh",
    "capital": "Dhaka",
    "continent": "Azja",
    "neighbors": [
      "IN",
      "MM"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "PH",
    "isoNumeric": "608",
    "namePl": "Filipiny",
    "nameEn": "Philippines",
    "capital": "Manila",
    "continent": "Azja",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "VN",
    "isoNumeric": "704",
    "namePl": "Wietnam",
    "nameEn": "Vietnam",
    "capital": "Hanoi",
    "continent": "Azja",
    "neighbors": [
      "CN",
      "LA",
      "KH"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "TH",
    "isoNumeric": "764",
    "namePl": "Tajlandia",
    "nameEn": "Thailand",
    "capital": "Bangkok",
    "continent": "Azja",
    "neighbors": [
      "MM",
      "LA",
      "KH",
      "MY"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "MM",
    "isoNumeric": "104",
    "namePl": "Mjanma",
    "nameEn": "Myanmar",
    "capital": "Naypyidaw",
    "continent": "Azja",
    "neighbors": [
      "BD",
      "IN",
      "CN",
      "LA",
      "TH"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "MY",
    "isoNumeric": "458",
    "namePl": "Malezja",
    "nameEn": "Malaysia",
    "capital": "Kuala Lumpur",
    "continent": "Azja",
    "neighbors": [
      "TH",
      "ID",
      "BN"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "SG",
    "isoNumeric": "702",
    "namePl": "Singapur",
    "nameEn": "Singapore",
    "capital": "Singapur",
    "continent": "Azja",
    "neighbors": [
      "MY"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "KR",
    "isoNumeric": "410",
    "namePl": "Korea Południowa",
    "nameEn": "South Korea",
    "capital": "Seul",
    "continent": "Azja",
    "neighbors": [
      "KP"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "KP",
    "isoNumeric": "408",
    "namePl": "Korea Północna",
    "nameEn": "North Korea",
    "capital": "Pjongjang",
    "continent": "Azja",
    "neighbors": [
      "CN",
      "RU",
      "KR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "TW",
    "isoNumeric": "158",
    "namePl": "Tajwan",
    "nameEn": "Taiwan",
    "capital": "Tajpej",
    "continent": "Azja",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "MN",
    "isoNumeric": "496",
    "namePl": "Mongolia",
    "nameEn": "Mongolia",
    "capital": "Ułan Bator",
    "continent": "Azja",
    "neighbors": [
      "RU",
      "CN"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "KZ",
    "isoNumeric": "398",
    "namePl": "Kazachstan",
    "nameEn": "Kazakhstan",
    "capital": "Astana",
    "continent": "Azja",
    "neighbors": [
      "RU",
      "CN",
      "KG",
      "UZ",
      "TM"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "UZ",
    "isoNumeric": "860",
    "namePl": "Uzbekistan",
    "nameEn": "Uzbekistan",
    "capital": "Taszkent",
    "continent": "Azja",
    "neighbors": [
      "KZ",
      "KG",
      "TJ",
      "AF",
      "TM"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "TM",
    "isoNumeric": "795",
    "namePl": "Turkmenistan",
    "nameEn": "Turkmenistan",
    "capital": "Aszchabad",
    "continent": "Azja",
    "neighbors": [
      "KZ",
      "UZ",
      "AF",
      "IR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "KG",
    "isoNumeric": "417",
    "namePl": "Kirgistan",
    "nameEn": "Kyrgyzstan",
    "capital": "Biszkek",
    "continent": "Azja",
    "neighbors": [
      "KZ",
      "CN",
      "TJ",
      "UZ"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "TJ",
    "isoNumeric": "762",
    "namePl": "Tadżykistan",
    "nameEn": "Tajikistan",
    "capital": "Duszanbe",
    "continent": "Azja",
    "neighbors": [
      "KG",
      "CN",
      "AF",
      "UZ"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "AF",
    "isoNumeric": "004",
    "namePl": "Afganistan",
    "nameEn": "Afghanistan",
    "capital": "Kabul",
    "continent": "Azja",
    "neighbors": [
      "TM",
      "UZ",
      "TJ",
      "CN",
      "PK",
      "IR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "IR",
    "isoNumeric": "364",
    "namePl": "Iran",
    "nameEn": "Iran",
    "capital": "Teheran",
    "continent": "Azja",
    "neighbors": [
      "TR",
      "AZ",
      "AM",
      "TM",
      "AF",
      "PK",
      "IQ"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "IQ",
    "isoNumeric": "368",
    "namePl": "Irak",
    "nameEn": "Iraq",
    "capital": "Bagdad",
    "continent": "Azja",
    "neighbors": [
      "TR",
      "IR",
      "KW",
      "SA",
      "JO",
      "SY"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "SY",
    "isoNumeric": "760",
    "namePl": "Syria",
    "nameEn": "Syria",
    "capital": "Damaszek",
    "continent": "Azja",
    "neighbors": [
      "TR",
      "IQ",
      "JO",
      "IL",
      "LB"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "LB",
    "isoNumeric": "422",
    "namePl": "Liban",
    "nameEn": "Lebanon",
    "capital": "Bejrut",
    "continent": "Azja",
    "neighbors": [
      "SY",
      "IL"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "JO",
    "isoNumeric": "400",
    "namePl": "Jordania",
    "nameEn": "Jordan",
    "capital": "Amman",
    "continent": "Azja",
    "neighbors": [
      "SY",
      "IQ",
      "SA",
      "IL",
      "PS"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "IL",
    "isoNumeric": "376",
    "namePl": "Izrael",
    "nameEn": "Israel",
    "capital": "Jerozolima",
    "continent": "Azja",
    "neighbors": [
      "LB",
      "SY",
      "JO",
      "EG",
      "PS"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "PS",
    "isoNumeric": "275",
    "namePl": "Palestyna",
    "nameEn": "Palestine",
    "capital": "Ramallah",
    "continent": "Azja",
    "neighbors": [
      "IL",
      "JO",
      "EG"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "SA",
    "isoNumeric": "682",
    "namePl": "Arabia Saudyjska",
    "nameEn": "Saudi Arabia",
    "capital": "Rijad",
    "continent": "Azja",
    "neighbors": [
      "JO",
      "IQ",
      "KW",
      "QA",
      "AE",
      "OM",
      "YE"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "AE",
    "isoNumeric": "784",
    "namePl": "Zjednoczone Emiraty Arabskie",
    "nameEn": "United Arab Emirates",
    "capital": "Abu Zabi",
    "continent": "Azja",
    "neighbors": [
      "SA",
      "OM"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "OM",
    "isoNumeric": "512",
    "namePl": "Oman",
    "nameEn": "Oman",
    "capital": "Maskat",
    "continent": "Azja",
    "neighbors": [
      "AE",
      "SA",
      "YE"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "YE",
    "isoNumeric": "887",
    "namePl": "Jemen",
    "nameEn": "Yemen",
    "capital": "Sana",
    "continent": "Azja",
    "neighbors": [
      "SA",
      "OM"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "QA",
    "isoNumeric": "634",
    "namePl": "Katar",
    "nameEn": "Qatar",
    "capital": "Doha",
    "continent": "Azja",
    "neighbors": [
      "SA"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "BH",
    "isoNumeric": "048",
    "namePl": "Bahrajn",
    "nameEn": "Bahrain",
    "capital": "Manama",
    "continent": "Azja",
    "neighbors": [
      "SA"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "KW",
    "isoNumeric": "414",
    "namePl": "Kuwejt",
    "nameEn": "Kuwait",
    "capital": "Kuwejt",
    "continent": "Azja",
    "neighbors": [
      "IQ",
      "SA"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "TR",
    "isoNumeric": "792",
    "namePl": "Turcja",
    "nameEn": "Turkey",
    "capital": "Ankara",
    "continent": "Azja",
    "neighbors": [
      "GR",
      "BG",
      "GE",
      "AM",
      "AZ",
      "IR",
      "IQ",
      "SY"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "GE",
    "isoNumeric": "268",
    "namePl": "Gruzja",
    "nameEn": "Georgia",
    "capital": "Tbilisi",
    "continent": "Azja",
    "neighbors": [
      "RU",
      "AZ",
      "AM",
      "TR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "AM",
    "isoNumeric": "051",
    "namePl": "Armenia",
    "nameEn": "Armenia",
    "capital": "Erywań",
    "continent": "Azja",
    "neighbors": [
      "GE",
      "AZ",
      "IR",
      "TR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "AZ",
    "isoNumeric": "031",
    "namePl": "Azerbejdżan",
    "nameEn": "Azerbaijan",
    "capital": "Baku",
    "continent": "Azja",
    "neighbors": [
      "RU",
      "GE",
      "AM",
      "IR",
      "TR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "LK",
    "isoNumeric": "144",
    "namePl": "Sri Lanka",
    "nameEn": "Sri Lanka",
    "capital": "Kolombo",
    "continent": "Azja",
    "neighbors": [
      "IN"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "NP",
    "isoNumeric": "524",
    "namePl": "Nepal",
    "nameEn": "Nepal",
    "capital": "Katmandu",
    "continent": "Azja",
    "neighbors": [
      "CN",
      "IN"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "BT",
    "isoNumeric": "064",
    "namePl": "Bhutan",
    "nameEn": "Bhutan",
    "capital": "Thimphu",
    "continent": "Azja",
    "neighbors": [
      "CN",
      "IN"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "MV",
    "isoNumeric": "462",
    "namePl": "Malediwy",
    "nameEn": "Maldives",
    "capital": "Male",
    "continent": "Azja",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "KH",
    "isoNumeric": "116",
    "namePl": "Kambodża",
    "nameEn": "Cambodia",
    "capital": "Phnom Penh",
    "continent": "Azja",
    "neighbors": [
      "TH",
      "LA",
      "VN"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "LA",
    "isoNumeric": "418",
    "namePl": "Laos",
    "nameEn": "Laos",
    "capital": "Wientian",
    "continent": "Azja",
    "neighbors": [
      "MM",
      "CN",
      "VN",
      "KH",
      "TH"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "TL",
    "isoNumeric": "626",
    "namePl": "Timor Wschodni",
    "nameEn": "East Timor",
    "capital": "Dili",
    "continent": "Azja",
    "neighbors": [
      "ID"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "BN",
    "isoNumeric": "096",
    "namePl": "Brunei",
    "nameEn": "Brunei",
    "capital": "Bandar Seri Begawan",
    "continent": "Azja",
    "neighbors": [
      "MY"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "RU",
    "isoNumeric": "643",
    "namePl": "Rosja",
    "nameEn": "Russia",
    "capital": "Moskwa",
    "continent": "Europa",
    "neighbors": [
      "NO",
      "FI",
      "EE",
      "LV",
      "LT",
      "PL",
      "BY",
      "UA",
      "GE",
      "AZ",
      "KZ",
      "CN",
      "MN",
      "KP"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "EG",
    "isoNumeric": "818",
    "namePl": "Egipt",
    "nameEn": "Egypt",
    "capital": "Kair",
    "continent": "Afryka",
    "neighbors": [
      "LY",
      "SD",
      "IL",
      "PS"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "LY",
    "isoNumeric": "434",
    "namePl": "Libia",
    "nameEn": "Libya",
    "capital": "Trypolis",
    "continent": "Afryka",
    "neighbors": [
      "EG",
      "SD",
      "TD",
      "NE",
      "DZ",
      "TN"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "TN",
    "isoNumeric": "788",
    "namePl": "Tunezja",
    "nameEn": "Tunisia",
    "capital": "Tunis",
    "continent": "Afryka",
    "neighbors": [
      "DZ",
      "LY"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "DZ",
    "isoNumeric": "012",
    "namePl": "Algieria",
    "nameEn": "Algeria",
    "capital": "Algier",
    "continent": "Afryka",
    "neighbors": [
      "TN",
      "LY",
      "NE",
      "ML",
      "MR",
      "MA"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "MA",
    "isoNumeric": "504",
    "namePl": "Maroko",
    "nameEn": "Morocco",
    "capital": "Rabat",
    "continent": "Afryka",
    "neighbors": [
      "DZ",
      "ES"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "SD",
    "isoNumeric": "729",
    "namePl": "Sudan",
    "nameEn": "Sudan",
    "capital": "Chartum",
    "continent": "Afryka",
    "neighbors": [
      "EG",
      "ER",
      "ET",
      "SS",
      "CF",
      "TD",
      "LY"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "SS",
    "isoNumeric": "728",
    "namePl": "Sudan Południowy",
    "nameEn": "South Sudan",
    "capital": "Dżuba",
    "continent": "Afryka",
    "neighbors": [
      "SD",
      "ET",
      "KE",
      "UG",
      "CD",
      "CF"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "ET",
    "isoNumeric": "231",
    "namePl": "Etiopia",
    "nameEn": "Ethiopia",
    "capital": "Addis Abeba",
    "continent": "Afryka",
    "neighbors": [
      "ER",
      "DJ",
      "SO",
      "KE",
      "SS",
      "SD"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "ER",
    "isoNumeric": "232",
    "namePl": "Erytrea",
    "nameEn": "Eritrea",
    "capital": "Asmara",
    "continent": "Afryka",
    "neighbors": [
      "SD",
      "ET",
      "DJ"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "DJ",
    "isoNumeric": "262",
    "namePl": "Dżibuti",
    "nameEn": "Djibouti",
    "capital": "Dżibuti",
    "continent": "Afryka",
    "neighbors": [
      "ER",
      "ET",
      "SO"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "SO",
    "isoNumeric": "706",
    "namePl": "Somalia",
    "nameEn": "Somalia",
    "capital": "Mogadiszu",
    "continent": "Afryka",
    "neighbors": [
      "DJ",
      "ET",
      "KE"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "KE",
    "isoNumeric": "404",
    "namePl": "Kenia",
    "nameEn": "Kenya",
    "capital": "Nairobi",
    "continent": "Afryka",
    "neighbors": [
      "SS",
      "ET",
      "SO",
      "TZ",
      "UG"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "UG",
    "isoNumeric": "800",
    "namePl": "Uganda",
    "nameEn": "Uganda",
    "capital": "Kampala",
    "continent": "Afryka",
    "neighbors": [
      "SS",
      "KE",
      "TZ",
      "RW",
      "CD"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "TZ",
    "isoNumeric": "834",
    "namePl": "Tanzania",
    "nameEn": "Tanzania",
    "capital": "Dodoma",
    "continent": "Afryka",
    "neighbors": [
      "KE",
      "UG",
      "RW",
      "BI",
      "CD",
      "ZM",
      "MW",
      "MZ"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "RW",
    "isoNumeric": "646",
    "namePl": "Rwanda",
    "nameEn": "Rwanda",
    "capital": "Kigali",
    "continent": "Afryka",
    "neighbors": [
      "UG",
      "TZ",
      "BI",
      "CD"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "BI",
    "isoNumeric": "108",
    "namePl": "Burundi",
    "nameEn": "Burundi",
    "capital": "Gitega",
    "continent": "Afryka",
    "neighbors": [
      "RW",
      "TZ",
      "CD"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "MZ",
    "isoNumeric": "508",
    "namePl": "Mozambik",
    "nameEn": "Mozambique",
    "capital": "Maputo",
    "continent": "Afryka",
    "neighbors": [
      "TZ",
      "MW",
      "ZM",
      "ZW",
      "ZA",
      "SZ"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "MW",
    "isoNumeric": "454",
    "namePl": "Malawi",
    "nameEn": "Malawi",
    "capital": "Lilongwe",
    "continent": "Afryka",
    "neighbors": [
      "TZ",
      "MZ",
      "ZM"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "ZM",
    "isoNumeric": "894",
    "namePl": "Zambia",
    "nameEn": "Zambia",
    "capital": "Lusaka",
    "continent": "Afryka",
    "neighbors": [
      "CD",
      "TZ",
      "MW",
      "MZ",
      "ZW",
      "BW",
      "NA",
      "AO"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "ZW",
    "isoNumeric": "716",
    "namePl": "Zimbabwe",
    "nameEn": "Zimbabwe",
    "capital": "Harare",
    "continent": "Afryka",
    "neighbors": [
      "ZM",
      "MZ",
      "ZA",
      "BW"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "BW",
    "isoNumeric": "072",
    "namePl": "Botswana",
    "nameEn": "Botswana",
    "capital": "Gaborone",
    "continent": "Afryka",
    "neighbors": [
      "NA",
      "ZM",
      "ZW",
      "ZA"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "NA",
    "isoNumeric": "516",
    "namePl": "Namibia",
    "nameEn": "Namibia",
    "capital": "Windhuk",
    "continent": "Afryka",
    "neighbors": [
      "AO",
      "ZM",
      "BW",
      "ZA"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "ZA",
    "isoNumeric": "710",
    "namePl": "Południowa Afryka",
    "nameEn": "South Africa",
    "capital": "Pretoria",
    "continent": "Afryka",
    "neighbors": [
      "NA",
      "BW",
      "ZW",
      "MZ",
      "SZ",
      "LS"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "LS",
    "isoNumeric": "426",
    "namePl": "Lesotho",
    "nameEn": "Lesotho",
    "capital": "Maseru",
    "continent": "Afryka",
    "neighbors": [
      "ZA"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "SZ",
    "isoNumeric": "748",
    "namePl": "Eswatini",
    "nameEn": "Eswatini",
    "capital": "Mbabane",
    "continent": "Afryka",
    "neighbors": [
      "ZA",
      "MZ"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "AO",
    "isoNumeric": "024",
    "namePl": "Angola",
    "nameEn": "Angola",
    "capital": "Luanda",
    "continent": "Afryka",
    "neighbors": [
      "CD",
      "CG",
      "ZM",
      "NA"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "CD",
    "isoNumeric": "180",
    "namePl": "Demokratyczna Republika Konga",
    "nameEn": "Democratic Republic of the Congo",
    "capital": "Kinszasa",
    "continent": "Afryka",
    "neighbors": [
      "CG",
      "CF",
      "SS",
      "UG",
      "RW",
      "BI",
      "TZ",
      "ZM",
      "AO"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "CG",
    "isoNumeric": "178",
    "namePl": "Kongo",
    "nameEn": "Republic of the Congo",
    "capital": "Brazzaville",
    "continent": "Afryka",
    "neighbors": [
      "GA",
      "CM",
      "CF",
      "CD",
      "AO"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "GA",
    "isoNumeric": "266",
    "namePl": "Gabon",
    "nameEn": "Gabon",
    "capital": "Libreville",
    "continent": "Afryka",
    "neighbors": [
      "GQ",
      "CM",
      "CG"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "GQ",
    "isoNumeric": "226",
    "namePl": "Gwinea Równikowa",
    "nameEn": "Equatorial Guinea",
    "capital": "Malabo",
    "continent": "Afryka",
    "neighbors": [
      "CM",
      "GA"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "CM",
    "isoNumeric": "120",
    "namePl": "Kamerun",
    "nameEn": "Cameroon",
    "capital": "Jaunde",
    "continent": "Afryka",
    "neighbors": [
      "NG",
      "TD",
      "CF",
      "CG",
      "GA",
      "GQ"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "CF",
    "isoNumeric": "140",
    "namePl": "Republika Środkowoafrykańska",
    "nameEn": "Central African Republic",
    "capital": "Bangi",
    "continent": "Afryka",
    "neighbors": [
      "TD",
      "SD",
      "SS",
      "CD",
      "CG",
      "CM"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "TD",
    "isoNumeric": "148",
    "namePl": "Czad",
    "nameEn": "Chad",
    "capital": "Ndżamena",
    "continent": "Afryka",
    "neighbors": [
      "LY",
      "SD",
      "CF",
      "CM",
      "NG",
      "NE"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "NE",
    "isoNumeric": "562",
    "namePl": "Niger",
    "nameEn": "Niger",
    "capital": "Niamey",
    "continent": "Afryka",
    "neighbors": [
      "DZ",
      "LY",
      "TD",
      "NG",
      "BJ",
      "BF",
      "ML"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "NG",
    "isoNumeric": "566",
    "namePl": "Nigeria",
    "nameEn": "Nigeria",
    "capital": "Abudża",
    "continent": "Afryka",
    "neighbors": [
      "NE",
      "TD",
      "CM",
      "BJ"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "BJ",
    "isoNumeric": "204",
    "namePl": "Benin",
    "nameEn": "Benin",
    "capital": "Porto-Novo",
    "continent": "Afryka",
    "neighbors": [
      "TG",
      "BF",
      "NE",
      "NG"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "TG",
    "isoNumeric": "768",
    "namePl": "Togo",
    "nameEn": "Togo",
    "capital": "Lomé",
    "continent": "Afryka",
    "neighbors": [
      "GH",
      "BF",
      "BJ"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "GH",
    "isoNumeric": "288",
    "namePl": "Ghana",
    "nameEn": "Ghana",
    "capital": "Akra",
    "continent": "Afryka",
    "neighbors": [
      "CI",
      "BF",
      "TG"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "CI",
    "isoNumeric": "384",
    "namePl": "Wybrzeże Kości Słoniowej",
    "nameEn": "Ivory Coast",
    "capital": "Jamusukro",
    "continent": "Afryka",
    "neighbors": [
      "LR",
      "GN",
      "ML",
      "BF",
      "GH"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "LR",
    "isoNumeric": "430",
    "namePl": "Liberia",
    "nameEn": "Liberia",
    "capital": "Monrovia",
    "continent": "Afryka",
    "neighbors": [
      "SL",
      "GN",
      "CI"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "SL",
    "isoNumeric": "694",
    "namePl": "Sierra Leone",
    "nameEn": "Sierra Leone",
    "capital": "Freetown",
    "continent": "Afryka",
    "neighbors": [
      "GN",
      "LR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "GN",
    "isoNumeric": "324",
    "namePl": "Gwinea",
    "nameEn": "Guinea",
    "capital": "Konakry",
    "continent": "Afryka",
    "neighbors": [
      "GW",
      "SN",
      "ML",
      "CI",
      "LR",
      "SL"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "GW",
    "isoNumeric": "624",
    "namePl": "Gwinea Bissau",
    "nameEn": "Guinea-Bissau",
    "capital": "Bissau",
    "continent": "Afryka",
    "neighbors": [
      "SN",
      "GN"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "GM",
    "isoNumeric": "270",
    "namePl": "Gambia",
    "nameEn": "Gambia",
    "capital": "Bandżul",
    "continent": "Afryka",
    "neighbors": [
      "SN"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "SN",
    "isoNumeric": "686",
    "namePl": "Senegal",
    "nameEn": "Senegal",
    "capital": "Dakar",
    "continent": "Afryka",
    "neighbors": [
      "MR",
      "ML",
      "GN",
      "GW",
      "GM"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "MR",
    "isoNumeric": "478",
    "namePl": "Mauretania",
    "nameEn": "Mauritania",
    "capital": "Nouakchott",
    "continent": "Afryka",
    "neighbors": [
      "MA",
      "DZ",
      "ML",
      "SN"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "ML",
    "isoNumeric": "466",
    "namePl": "Mali",
    "nameEn": "Mali",
    "capital": "Bamako",
    "continent": "Afryka",
    "neighbors": [
      "DZ",
      "NE",
      "BF",
      "CI",
      "GN",
      "SN",
      "MR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "BF",
    "isoNumeric": "854",
    "namePl": "Burkina Faso",
    "nameEn": "Burkina Faso",
    "capital": "Wagadugu",
    "continent": "Afryka",
    "neighbors": [
      "ML",
      "NE",
      "BJ",
      "TG",
      "GH",
      "CI"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "MG",
    "isoNumeric": "450",
    "namePl": "Madagaskar",
    "nameEn": "Madagascar",
    "capital": "Antananarywa",
    "continent": "Afryka",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "MU",
    "isoNumeric": "480",
    "namePl": "Mauritius",
    "nameEn": "Mauritius",
    "capital": "Port Louis",
    "continent": "Afryka",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "SC",
    "isoNumeric": "690",
    "namePl": "Seszele",
    "nameEn": "Seychelles",
    "capital": "Victoria",
    "continent": "Afryka",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "KM",
    "isoNumeric": "174",
    "namePl": "Komory",
    "nameEn": "Comoros",
    "capital": "Moroni",
    "continent": "Afryka",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "CV",
    "isoNumeric": "132",
    "namePl": "Republika Zielonego Przylądka",
    "nameEn": "Cape Verde",
    "capital": "Praia",
    "continent": "Afryka",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "ST",
    "isoNumeric": "678",
    "namePl": "Wyspy Świętego Tomasza i Książęca",
    "nameEn": "Sao Tome and Principe",
    "capital": "São Tomé",
    "continent": "Afryka",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "US",
    "isoNumeric": "840",
    "namePl": "Stany Zjednoczone",
    "nameEn": "United States of America",
    "capital": "Waszyngton",
    "continent": "Ameryka Północna",
    "neighbors": [
      "CA",
      "MX"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "CA",
    "isoNumeric": "124",
    "namePl": "Kanada",
    "nameEn": "Canada",
    "capital": "Ottawa",
    "continent": "Ameryka Północna",
    "neighbors": [
      "US"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "MX",
    "isoNumeric": "484",
    "namePl": "Meksyk",
    "nameEn": "Mexico",
    "capital": "Meksyk",
    "continent": "Ameryka Północna",
    "neighbors": [
      "US",
      "GT",
      "BZ"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "GT",
    "isoNumeric": "320",
    "namePl": "Gwatemala",
    "nameEn": "Guatemala",
    "capital": "Gwatemala",
    "continent": "Ameryka Północna",
    "neighbors": [
      "MX",
      "BZ",
      "HN",
      "SV"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "BZ",
    "isoNumeric": "084",
    "namePl": "Belize",
    "nameEn": "Belize",
    "capital": "Belmopan",
    "continent": "Ameryka Północna",
    "neighbors": [
      "MX",
      "GT"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "SV",
    "isoNumeric": "222",
    "namePl": "Salwador",
    "nameEn": "El Salvador",
    "capital": "San Salvador",
    "continent": "Ameryka Północna",
    "neighbors": [
      "GT",
      "HN"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "HN",
    "isoNumeric": "340",
    "namePl": "Honduras",
    "nameEn": "Honduras",
    "capital": "Tegucigalpa",
    "continent": "Ameryka Północna",
    "neighbors": [
      "GT",
      "SV",
      "NI"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "NI",
    "isoNumeric": "558",
    "namePl": "Nikaragua",
    "nameEn": "Nicaragua",
    "capital": "Managua",
    "continent": "Ameryka Północna",
    "neighbors": [
      "HN",
      "CR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "CR",
    "isoNumeric": "188",
    "namePl": "Kostaryka",
    "nameEn": "Costa Rica",
    "capital": "San José",
    "continent": "Ameryka Północna",
    "neighbors": [
      "NI",
      "PA"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "PA",
    "isoNumeric": "591",
    "namePl": "Panama",
    "nameEn": "Panama",
    "capital": "Panama",
    "continent": "Ameryka Północna",
    "neighbors": [
      "CR",
      "CO"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "CU",
    "isoNumeric": "192",
    "namePl": "Kuba",
    "nameEn": "Cuba",
    "capital": "Hawana",
    "continent": "Ameryka Północna",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "JM",
    "isoNumeric": "388",
    "namePl": "Jamajka",
    "nameEn": "Jamaica",
    "capital": "Kingston",
    "continent": "Ameryka Północna",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "HT",
    "isoNumeric": "332",
    "namePl": "Haiti",
    "nameEn": "Haiti",
    "capital": "Port-au-Prince",
    "continent": "Ameryka Północna",
    "neighbors": [
      "DO"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "DO",
    "isoNumeric": "214",
    "namePl": "Dominikana",
    "nameEn": "Dominican Republic",
    "capital": "Santo Domingo",
    "continent": "Ameryka Północna",
    "neighbors": [
      "HT"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "BS",
    "isoNumeric": "044",
    "namePl": "Bahamy",
    "nameEn": "Bahamas",
    "capital": "Nassau",
    "continent": "Ameryka Północna",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "TT",
    "isoNumeric": "780",
    "namePl": "Trynidad i Tobago",
    "nameEn": "Trinidad and Tobago",
    "capital": "Port-of-Spain",
    "continent": "Ameryka Północna",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "BB",
    "isoNumeric": "052",
    "namePl": "Barbados",
    "nameEn": "Barbados",
    "capital": "Bridgetown",
    "continent": "Ameryka Północna",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "LC",
    "isoNumeric": "662",
    "namePl": "Saint Lucia",
    "nameEn": "Saint Lucia",
    "capital": "Castries",
    "continent": "Ameryka Północna",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "VC",
    "isoNumeric": "670",
    "namePl": "Saint Vincent i Grenadyny",
    "nameEn": "Saint Vincent and the Grenadines",
    "capital": "Kingstown",
    "continent": "Ameryka Północna",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "GD",
    "isoNumeric": "308",
    "namePl": "Grenada",
    "nameEn": "Grenada",
    "capital": "Saint George's",
    "continent": "Ameryka Północna",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "AG",
    "isoNumeric": "028",
    "namePl": "Antigua i Barbuda",
    "nameEn": "Antigua and Barbuda",
    "capital": "Saint John's",
    "continent": "Ameryka Północna",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "KN",
    "isoNumeric": "659",
    "namePl": "Saint Kitts i Nevis",
    "nameEn": "Saint Kitts and Nevis",
    "capital": "Basseterre",
    "continent": "Ameryka Północna",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "DM",
    "isoNumeric": "212",
    "namePl": "Dominika",
    "nameEn": "Dominica",
    "capital": "Roseau",
    "continent": "Ameryka Północna",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "BR",
    "isoNumeric": "076",
    "namePl": "Brazylia",
    "nameEn": "Brazil",
    "capital": "Brasília",
    "continent": "Ameryka Południowa",
    "neighbors": [
      "UY",
      "AR",
      "PY",
      "BO",
      "PE",
      "CO",
      "VE",
      "GY",
      "SR",
      "FR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "AR",
    "isoNumeric": "032",
    "namePl": "Argentyna",
    "nameEn": "Argentina",
    "capital": "Buenos Aires",
    "continent": "Ameryka Południowa",
    "neighbors": [
      "CL",
      "BO",
      "PY",
      "BR",
      "UY"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "CL",
    "isoNumeric": "152",
    "namePl": "Chile",
    "nameEn": "Chile",
    "capital": "Santiago",
    "continent": "Ameryka Południowa",
    "neighbors": [
      "PE",
      "BO",
      "AR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "PE",
    "isoNumeric": "604",
    "namePl": "Peru",
    "nameEn": "Peru",
    "capital": "Lima",
    "continent": "Ameryka Południowa",
    "neighbors": [
      "EC",
      "CO",
      "BR",
      "BO",
      "CL"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "CO",
    "isoNumeric": "170",
    "namePl": "Kolumbia",
    "nameEn": "Colombia",
    "capital": "Bogota",
    "continent": "Ameryka Południowa",
    "neighbors": [
      "PA",
      "VE",
      "BR",
      "PE",
      "EC"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "VE",
    "isoNumeric": "862",
    "namePl": "Wenezuela",
    "nameEn": "Venezuela",
    "capital": "Caracas",
    "continent": "Ameryka Południowa",
    "neighbors": [
      "CO",
      "BR",
      "GY"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "EC",
    "isoNumeric": "218",
    "namePl": "Ekwador",
    "nameEn": "Ecuador",
    "capital": "Quito",
    "continent": "Ameryka Południowa",
    "neighbors": [
      "CO",
      "PE"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "BO",
    "isoNumeric": "068",
    "namePl": "Boliwia",
    "nameEn": "Bolivia",
    "capital": "Sucre",
    "continent": "Ameryka Południowa",
    "neighbors": [
      "BR",
      "PY",
      "AR",
      "CL",
      "PE"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "PY",
    "isoNumeric": "600",
    "namePl": "Paragwaj",
    "nameEn": "Paraguay",
    "capital": "Asunción",
    "continent": "Ameryka Południowa",
    "neighbors": [
      "BO",
      "BR",
      "AR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "UY",
    "isoNumeric": "858",
    "namePl": "Urugwaj",
    "nameEn": "Uruguay",
    "capital": "Montevideo",
    "continent": "Ameryka Południowa",
    "neighbors": [
      "AR",
      "BR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "GY",
    "isoNumeric": "328",
    "namePl": "Gujana",
    "nameEn": "Guyana",
    "capital": "Georgetown",
    "continent": "Ameryka Południowa",
    "neighbors": [
      "VE",
      "BR",
      "SR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "SR",
    "isoNumeric": "740",
    "namePl": "Surinam",
    "nameEn": "Suriname",
    "capital": "Paramaribo",
    "continent": "Ameryka Południowa",
    "neighbors": [
      "GY",
      "FR",
      "BR"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "AU",
    "isoNumeric": "036",
    "namePl": "Australia",
    "nameEn": "Australia",
    "capital": "Canberra",
    "continent": "Oceania",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "NZ",
    "isoNumeric": "554",
    "namePl": "Nowa Zelandia",
    "nameEn": "New Zealand",
    "capital": "Wellington",
    "continent": "Oceania",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "PG",
    "isoNumeric": "598",
    "namePl": "Papua-Nowa Gwinea",
    "nameEn": "Papua New Guinea",
    "capital": "Port Moresby",
    "continent": "Oceania",
    "neighbors": [
      "ID"
    ],
    "difficultyWeight": 1
  },
  {
    "iso2": "FJ",
    "isoNumeric": "242",
    "namePl": "Fidżi",
    "nameEn": "Fiji",
    "capital": "Suva",
    "continent": "Oceania",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "SB",
    "isoNumeric": "090",
    "namePl": "Wyspy Salomona",
    "nameEn": "Solomon Islands",
    "capital": "Honiara",
    "continent": "Oceania",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "VU",
    "isoNumeric": "548",
    "namePl": "Vanuatu",
    "nameEn": "Vanuatu",
    "capital": "Port Vila",
    "continent": "Oceania",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "WS",
    "isoNumeric": "882",
    "namePl": "Samoa",
    "nameEn": "Samoa",
    "capital": "Apia",
    "continent": "Oceania",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "TO",
    "isoNumeric": "776",
    "namePl": "Tonga",
    "nameEn": "Tonga",
    "capital": "Nukuʻalofa",
    "continent": "Oceania",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "FM",
    "isoNumeric": "583",
    "namePl": "Mikronezja",
    "nameEn": "Micronesia",
    "capital": "Palikir",
    "continent": "Oceania",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "MH",
    "isoNumeric": "584",
    "namePl": "Wyspy Marshalla",
    "nameEn": "Marshall Islands",
    "capital": "Majuro",
    "continent": "Oceania",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "PW",
    "isoNumeric": "585",
    "namePl": "Palau",
    "nameEn": "Palau",
    "capital": "Ngerulmud",
    "continent": "Oceania",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "KI",
    "isoNumeric": "296",
    "namePl": "Kiribati",
    "nameEn": "Kiribati",
    "capital": "Bairiki",
    "continent": "Oceania",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "NR",
    "isoNumeric": "520",
    "namePl": "Nauru",
    "nameEn": "Nauru",
    "capital": "Yaren",
    "continent": "Oceania",
    "neighbors": [],
    "difficultyWeight": 1
  },
  {
    "iso2": "TV",
    "isoNumeric": "798",
    "namePl": "Tuvalu",
    "nameEn": "Tuvalu",
    "capital": "Funafuti",
    "continent": "Oceania",
    "neighbors": [],
    "difficultyWeight": 1
  }
];
