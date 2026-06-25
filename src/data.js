// data.js
export const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
};

export const getAvailabilityColor = (freeSpots, totalSpots) => {
  if (freeSpots === 0) return 'var(--color-error)';
  const ratio = freeSpots / totalSpots;
  if (ratio < 0.25) return 'var(--color-warning)';
  return 'var(--color-success)';
};

export const findNearestAvailable = (currentParking, allParkings, count = 1) => {
  let available = allParkings
    .filter(p => p.id !== currentParking.id && p.freeSpots > 0)
    .map(p => {
      const dist = getDistance(currentParking.lat, currentParking.lng, p.lat, p.lng);
      return { parking: p, dist: dist * 1000 }; // dist in meters
    });

  available.sort((a, b) => a.dist - b.dist);
  
  if (count === 1) {
    return { nearest: available[0]?.parking, minDistance: available[0]?.dist };
  }
  return available.slice(0, count);
};

// Generates 100 parkings distributed across Madrid neighborhoods
const generateParkings = () => {
  const regions = [
    { 
      name: 'Centro', lat: [40.410, 40.430], lng: [-3.715, -3.695], price: [1.8, 2.0], spots: [40, 150], 
      names: ["Parking Lavapiés", "Parking Tirso de Molina", "Parking Antón Martín", "Parking Sol", "Parking Plaza Mayor", "Parking Ópera", "Parking Callao", "Parking Gran Vía", "Parking Santo Domingo"]
    },
    { 
      name: 'Salamanca', lat: [40.425, 40.440], lng: [-3.685, -3.665], price: [1.8, 2.0], spots: [40, 150],
      names: ["Parking Serrano", "Parking Velázquez", "Parking Jorge Juan", "Parking Goya", "Parking Príncipe de Vergara", "Parking Alcalá", "Parking Conde de Peñalver", "Parking Lista", "Parking Núñez de Balboa"]
    },
    { 
      name: 'Chamberí', lat: [40.430, 40.445], lng: [-3.715, -3.695], price: [1.5, 1.8], spots: [40, 150],
      names: ["Parking Tribunal", "Parking Alonso Martínez", "Parking Bilbao", "Parking Quevedo", "Parking Iglesia", "Parking Ríos Rosas", "Parking Canal", "Parking San Bernardo"]
    },
    { 
      name: 'Retiro', lat: [40.405, 40.420], lng: [-3.685, -3.665], price: [1.5, 1.8], spots: [40, 150],
      names: ["Parking Ibiza", "Parking Sainz de Baranda", "Parking Estrella", "Parking Menéndez Pelayo", "Parking Pacífico", "Parking Jerónimos", "Parking Alcalde Sainz"]
    },
    { 
      name: 'Arganzuela', lat: [40.395, 40.410], lng: [-3.715, -3.695], price: [1.2, 1.5], spots: [80, 200],
      names: ["Parking Delicias", "Parking Legazpi", "Parking Embajadores", "Parking Pirámides", "Parking Méndez Álvaro", "Parking Acacias", "Parking Palos de la Frontera", "Parking Chopera"]
    },
    { 
      name: 'Carabanchel', lat: [40.370, 40.395], lng: [-3.755, -3.725], price: [0.5, 0.9], spots: [100, 300],
      names: ["Parking Oporto", "Parking Marqués de Vadillo", "Parking Urgel", "Parking Vista Alegre", "Parking Carabanchel Alto", "Parking San Isidro", "Parking Eugenia de Montijo", "Parking Pan Bendito"]
    },
    { 
      name: 'Usera', lat: [40.375, 40.390], lng: [-3.715, -3.695], price: [0.5, 0.9], spots: [100, 300],
      names: ["Parking Plaza Elíptica", "Parking Almendrales", "Parking Doce de Octubre", "Parking San Fermín", "Parking Orcasitas", "Parking Pradolongo", "Parking Zofío"]
    },
    { 
      name: 'Puente de Vallecas', lat: [40.380, 40.400], lng: [-3.675, -3.645], price: [0.5, 0.9], spots: [100, 300],
      names: ["Parking Nueva Numancia", "Parking Portazgo", "Parking Buenos Aires", "Parking Alto del Arenal", "Parking Entrevías", "Parking Palomeras", "Parking San Diego"]
    },
    { 
      name: 'Moratalaz', lat: [40.400, 40.415], lng: [-3.655, -3.635], price: [0.5, 0.9], spots: [100, 300],
      names: ["Parking Estrella", "Parking Vinateros", "Parking Artilleros", "Parking Pavones", "Parking Horcajo", "Parking Fontarrón", "Parking Marroquina"]
    },
    { 
      name: 'Ciudad Lineal', lat: [40.420, 40.445], lng: [-3.655, -3.635], price: [0.7, 1.1], spots: [80, 200],
      names: ["Parking Quintana", "Parking Pueblo Nuevo", "Parking Ciudad Lineal", "Parking Arturo Soria", "Parking La Elipa", "Parking Ventas", "Parking Ascao", "Parking García Noblejas"]
    },
    { 
      name: 'Hortaleza', lat: [40.455, 40.480], lng: [-3.655, -3.625], price: [0.7, 1.1], spots: [80, 200],
      names: ["Parking Mar de Cristal", "Parking Canillas", "Parking Esperanza", "Parking Pinar del Rey", "Parking San Lorenzo", "Parking Parque de Santa María", "Parking Manoteras"]
    },
    { 
      name: 'Fuencarral', lat: [40.470, 40.500], lng: [-3.715, -3.685], price: [0.7, 1.1], spots: [100, 300],
      names: ["Parking Begoña", "Parking Fuencarral", "Parking Tres Olivos", "Parking Montecarmelo", "Parking Las Tablas", "Parking Mirasierra", "Parking Barrio del Pilar", "Parking Peñagrande"]
    },
    { 
      name: 'Moncloa', lat: [40.425, 40.445], lng: [-3.745, -3.715], price: [1.2, 1.6], spots: [80, 200],
      names: ["Parking Moncloa", "Parking Argüelles", "Parking Ciudad Universitaria", "Parking Princesa", "Parking Pintor Rosales", "Parking Parque del Oeste", "Parking Ferraz", "Parking Templo de Debod"]
    },
    { 
      name: 'Latina', lat: [40.385, 40.410], lng: [-3.765, -3.735], price: [0.5, 0.9], spots: [100, 300],
      names: ["Parking Aluche", "Parking Campamento", "Parking Empalme", "Parking Lucero", "Parking Laguna", "Parking Batán", "Parking Puerta del Ángel"]
    },
    { 
      name: 'Vicálvaro', lat: [40.395, 40.415], lng: [-3.625, -3.595], price: [0.5, 0.9], spots: [100, 300],
      names: ["Parking Vicálvaro", "Parking San Cipriano", "Parking Puerta de Arganda", "Parking Valdebernardo", "Parking Valderrivas", "Parking Casco Histórico"]
    }
  ];

  const result = [];
  let idCounter = 1;

  // We have 15 regions and need 100 parkings, ~6-7 per region
  regions.forEach(hood => {
    const numParkings = Math.min(hood.names.length, 6 + Math.floor(Math.random() * 2));
    
    // Pick random names without replacement
    const shuffledNames = [...hood.names].sort(() => 0.5 - Math.random());
    const selectedNames = shuffledNames.slice(0, numParkings);

    selectedNames.forEach(name => {
      const lat = hood.lat[0] + Math.random() * (hood.lat[1] - hood.lat[0]);
      const lng = hood.lng[0] + Math.random() * (hood.lng[1] - hood.lng[0]);
      
      const pricePerHour = +(hood.price[0] + Math.random() * (hood.price[1] - hood.price[0])).toFixed(2);
      const totalSpots = Math.floor(Math.random() * (hood.spots[1] - hood.spots[0] + 1)) + hood.spots[0];
      
      const rand = Math.random();
      let freeSpots = 0;
      if (rand < 0.25) {
        freeSpots = 0; // full
      } else if (rand < 0.60) {
        // almost full (1 to 24%)
        const maxFree = Math.max(1, Math.floor(totalSpots * 0.24));
        freeSpots = Math.floor(Math.random() * maxFree) + 1;
      } else {
        // available (25% to 100%)
        const minFree = Math.floor(totalSpots * 0.25) + 1;
        freeSpots = Math.floor(Math.random() * (totalSpots - minFree + 1)) + minFree;
      }

      const isCentral = hood.price[0] >= 1.2;
      const hours = isCentral || Math.random() < 0.7 ? "24h · 7 días" : "07:00 - 23:00";

      result.push({
        id: idCounter++,
        name: name,
        lat: lat,
        lng: lng,
        address: `${name.replace('Parking ', 'Calle de ')}, Madrid`,
        freeSpots,
        totalSpots,
        pricePerHour,
        additionalHour: +(pricePerHour * 0.8).toFixed(2),
        hours
      });
    });
  });

  // Ensure exactly 100 if we didn't hit it precisely
  while (result.length < 100) {
    const hood = regions[Math.floor(Math.random() * regions.length)];
    const name = hood.names[Math.floor(Math.random() * hood.names.length)] + " II";
    const lat = hood.lat[0] + Math.random() * (hood.lat[1] - hood.lat[0]);
    const lng = hood.lng[0] + Math.random() * (hood.lng[1] - hood.lng[0]);
    const pricePerHour = +(hood.price[0] + Math.random() * (hood.price[1] - hood.price[0])).toFixed(2);
    const totalSpots = Math.floor(Math.random() * (hood.spots[1] - hood.spots[0] + 1)) + hood.spots[0];
    
    const minFree = Math.floor(totalSpots * 0.25) + 1;
    const freeSpots = Math.floor(Math.random() * (totalSpots - minFree + 1)) + minFree;
    
    result.push({
      id: idCounter++,
      name: name,
      lat: lat,
      lng: lng,
      address: `${name.replace('Parking ', 'Calle de ')}, Madrid`,
      freeSpots,
      totalSpots,
      pricePerHour,
      additionalHour: +(pricePerHour * 0.8).toFixed(2),
      hours: "24h · 7 días"
    });
  }

  // Trim to exactly 100 if over
  if (result.length > 100) {
    result.length = 100;
  }

  return result;
};

export const parkings = generateParkings();
