<?php

$unsplash = fn (string $file, string $description, string $creator, string $id) => [
    'file' => $file,
    'description' => $description,
    'creator' => $creator,
    'source' => 'Unsplash',
    'url' => "https://unsplash.com/photos/{$id}",
    'license' => 'Unsplash License',
    'license_url' => 'https://unsplash.com/license',
];

$licenses = [
    'CC BY 2.0' => 'https://creativecommons.org/licenses/by/2.0',
    'CC BY 4.0' => 'https://creativecommons.org/licenses/by/4.0',
    'CC BY-SA 4.0' => 'https://creativecommons.org/licenses/by-sa/4.0',
];

$commons = fn (string $file, string $description, string $creator, string $page, string $license) => [
    'file' => $file,
    'description' => $description,
    'creator' => $creator,
    'source' => 'Wikimedia Commons',
    'url' => "https://commons.wikimedia.org/wiki/File:{$page}",
    'license' => $license,
    'license_url' => $licenses[$license],
];

return [
    'name' => 'Beyond the Map',
    'tagline' => 'The world is bigger than your comfort zone.',
    'contact_email' => env('CONTACT_EMAIL'),
    'max_upload_kb' => 2048,

    'credits' => [
        $commons('kanlaon-volcano.jpg', 'Homepage hero and Mount Kanlaon destination: drone view of Mount Kanlaon', 'Bien02', 'Drone_Shot_of_Mt._Kanlaon.jpg', 'CC BY 4.0'),
        $commons('kanlaon-trail.jpg', 'Trail in Don Salvador Benedicto with Mount Kanlaon in the distance', 'Jmevangelist', 'Mt._Kanlaon_view_from_Don_Salvador_Benedicto.jpg', 'CC BY-SA 4.0'),
        $commons('sipalay-beach.jpg', 'Sipalay Beach, Negros Occidental', 'Paolobon140', 'Sipalay_Beach_(Negros_Occidental,_Philippines).jpg', 'CC BY-SA 4.0'),
        $unsplash('the-ruins.jpg', 'The Ruins, Talisay, Negros Occidental', 'Brian Kairuz', 'QsRG5VAPNQo'),
        $commons('balay-negrense.jpg', 'Balay Negrense, Silay, Negros Occidental', 'Herbertkikoy', 'Balay_Negrense_in_Silay.jpg', 'CC BY-SA 4.0'),
        $unsplash('dumaguete-market.jpg', 'Fruit stall at a market in Dumaguete City', 'MacroLingo LLC', 'qt39AU-AE6s'),
        $commons('apo-turtle.jpg', 'Sea turtle resting on coral at Apo Island', 'Anna Varona', 'Sea_Turtle_in_Apo_Island.jpg', 'CC BY 4.0'),
        $unsplash('apo-reef-turtle.jpg', 'Sea turtle swimming over the reef at Apo Island', 'Gianni Orsatti', 'UcFzZLmQcW0'),
        $commons('manjuyod-sandbar.jpg', 'Cottages on stilts at Manjuyod Sandbar, Negros Oriental', 'Patrickroque01', 'Manjuyod_Sandbar_cottages_(Bais,_Negros_Oriental;_01-19-2023).jpg', 'CC BY-SA 4.0'),
        $commons('twin-lakes-mist.jpg', 'Mist over the Balinsasayao Twin Lakes', 'Vincent Lecolley', 'The_lake_in_the_clouds.jpg', 'CC BY-SA 4.0'),
        $commons('twin-lakes-trees.jpg', 'Trees reflected in the Balinsasayao Twin Lakes', 'Francisco M. Pajares, Jr.', 'Balinsasayao_Twin_Lakes.jpg', 'CC BY-SA 4.0'),
        $unsplash('siquijor-cliff.jpg', 'Cliff-side stairway above turquoise water, Siquijor', 'Nikko Lawrence Uy', 'u3Zf-4hPrh4'),
        $commons('cambugahay-falls.jpg', 'Cambugahay Falls, Siquijor', 'Harry Fozzard', 'Cambugahay_Falls_DSC00147_(34018408676).jpg', 'CC BY 2.0'),
        $commons('salagdoong-beach.jpg', 'Salagdoong Beach, Siquijor', 'Genpasaporte2', 'Salagdoong_Beach_Siquijor-Daylight.jpg', 'CC BY-SA 4.0'),
        $unsplash('negros-beach-aerial.jpg', 'About page hero: aerial view of a palm-lined beach, Negros Oriental', 'XT7 Core', 'cArUZmt2Wfc'),
    ],
];
