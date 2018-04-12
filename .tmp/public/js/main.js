let restaurants,
  neighborhoods,
  cuisines;
var map;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
};

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const picture = document.createElement('picture');
  li.append(picture);

  const largeSourceWebp = document.createElement('source');
  largeSourceWebp.media = "(min-width: 750px)";
  largeSourceWebp.srcset = DBHelper.imageUrlForRestaurant(restaurant) + '-800_large.webp';
  largeSourceWebp.type = "image/webp";
  picture.append(largeSourceWebp);

  const largeSource = document.createElement('source');
  largeSource.media = "(min-width: 750px)";
  largeSource.srcset = DBHelper.imageUrlForRestaurant(restaurant) + '-800_large.jpg';
  largeSource.type = "image/jpeg";
  picture.append(largeSource);

  const mediumSourceWebp = document.createElement('source');
  mediumSourceWebp.media = "(min-width: 500px)";
  mediumSourceWebp.srcset = DBHelper.imageUrlForRestaurant(restaurant) + '_medium.webp';
  mediumSourceWebp.type = "image/webp";
  picture.append(mediumSourceWebp);

  const mediumSource = document.createElement('source');
  mediumSource.media = "(min-width: 500px)";
  mediumSource.srcset = DBHelper.imageUrlForRestaurant(restaurant) + '_medium.jpg';
  mediumSource.type = "image/jpeg";
  picture.append(mediumSource);

  const sourceWebp = document.createElement('source');
  sourceWebp.srcset = DBHelper.imageUrlForRestaurant(restaurant) + '.webp';
  picture.append(sourceWebp);

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant) + '.jpg';
  image.alt = restaurant.name + ' is a ' + restaurant.cuisine_type + ' restaurant in ' + restaurant.address + '.';
  picture.append(image);

  const name = document.createElement('h3');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.setAttribute('role', 'button');
  more.setAttribute('aria-label', restaurant.name);
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCByZXN0YXVyYW50cyxcbiAgbmVpZ2hib3Job29kcyxcbiAgY3Vpc2luZXM7XG52YXIgbWFwO1xudmFyIG1hcmtlcnMgPSBbXTtcblxuLyoqXG4gKiBGZXRjaCBuZWlnaGJvcmhvb2RzIGFuZCBjdWlzaW5lcyBhcyBzb29uIGFzIHRoZSBwYWdlIGlzIGxvYWRlZC5cbiAqL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIChldmVudCkgPT4ge1xuICBmZXRjaE5laWdoYm9yaG9vZHMoKTtcbiAgZmV0Y2hDdWlzaW5lcygpO1xufSk7XG5cbi8qKlxuICogRmV0Y2ggYWxsIG5laWdoYm9yaG9vZHMgYW5kIHNldCB0aGVpciBIVE1MLlxuICovXG5mZXRjaE5laWdoYm9yaG9vZHMgPSAoKSA9PiB7XG4gIERCSGVscGVyLmZldGNoTmVpZ2hib3Job29kcygoZXJyb3IsIG5laWdoYm9yaG9vZHMpID0+IHtcbiAgICBpZiAoZXJyb3IpIHsgLy8gR290IGFuIGVycm9yXG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5uZWlnaGJvcmhvb2RzID0gbmVpZ2hib3Job29kcztcbiAgICAgIGZpbGxOZWlnaGJvcmhvb2RzSFRNTCgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG4vKipcbiAqIFNldCBuZWlnaGJvcmhvb2RzIEhUTUwuXG4gKi9cbmZpbGxOZWlnaGJvcmhvb2RzSFRNTCA9IChuZWlnaGJvcmhvb2RzID0gc2VsZi5uZWlnaGJvcmhvb2RzKSA9PiB7XG4gIGNvbnN0IHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZWlnaGJvcmhvb2RzLXNlbGVjdCcpO1xuICBuZWlnaGJvcmhvb2RzLmZvckVhY2gobmVpZ2hib3Job29kID0+IHtcbiAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBvcHRpb24uaW5uZXJIVE1MID0gbmVpZ2hib3Job29kO1xuICAgIG9wdGlvbi52YWx1ZSA9IG5laWdoYm9yaG9vZDtcbiAgICBzZWxlY3QuYXBwZW5kKG9wdGlvbik7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBGZXRjaCBhbGwgY3Vpc2luZXMgYW5kIHNldCB0aGVpciBIVE1MLlxuICovXG5mZXRjaEN1aXNpbmVzID0gKCkgPT4ge1xuICBEQkhlbHBlci5mZXRjaEN1aXNpbmVzKChlcnJvciwgY3Vpc2luZXMpID0+IHtcbiAgICBpZiAoZXJyb3IpIHsgLy8gR290IGFuIGVycm9yIVxuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuY3Vpc2luZXMgPSBjdWlzaW5lcztcbiAgICAgIGZpbGxDdWlzaW5lc0hUTUwoKTtcbiAgICB9XG4gIH0pO1xufTtcblxuLyoqXG4gKiBTZXQgY3Vpc2luZXMgSFRNTC5cbiAqL1xuZmlsbEN1aXNpbmVzSFRNTCA9IChjdWlzaW5lcyA9IHNlbGYuY3Vpc2luZXMpID0+IHtcbiAgY29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1aXNpbmVzLXNlbGVjdCcpO1xuXG4gIGN1aXNpbmVzLmZvckVhY2goY3Vpc2luZSA9PiB7XG4gICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgb3B0aW9uLmlubmVySFRNTCA9IGN1aXNpbmU7XG4gICAgb3B0aW9uLnZhbHVlID0gY3Vpc2luZTtcbiAgICBzZWxlY3QuYXBwZW5kKG9wdGlvbik7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIEdvb2dsZSBtYXAsIGNhbGxlZCBmcm9tIEhUTUwuXG4gKi9cbndpbmRvdy5pbml0TWFwID0gKCkgPT4ge1xuICBsZXQgbG9jID0ge1xuICAgIGxhdDogNDAuNzIyMjE2LFxuICAgIGxuZzogLTczLjk4NzUwMVxuICB9O1xuICBzZWxmLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgem9vbTogMTIsXG4gICAgY2VudGVyOiBsb2MsXG4gICAgc2Nyb2xsd2hlZWw6IGZhbHNlXG4gIH0pO1xuICB1cGRhdGVSZXN0YXVyYW50cygpO1xufTtcblxuLyoqXG4gKiBVcGRhdGUgcGFnZSBhbmQgbWFwIGZvciBjdXJyZW50IHJlc3RhdXJhbnRzLlxuICovXG51cGRhdGVSZXN0YXVyYW50cyA9ICgpID0+IHtcbiAgY29uc3QgY1NlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdWlzaW5lcy1zZWxlY3QnKTtcbiAgY29uc3QgblNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZWlnaGJvcmhvb2RzLXNlbGVjdCcpO1xuXG4gIGNvbnN0IGNJbmRleCA9IGNTZWxlY3Quc2VsZWN0ZWRJbmRleDtcbiAgY29uc3QgbkluZGV4ID0gblNlbGVjdC5zZWxlY3RlZEluZGV4O1xuXG4gIGNvbnN0IGN1aXNpbmUgPSBjU2VsZWN0W2NJbmRleF0udmFsdWU7XG4gIGNvbnN0IG5laWdoYm9yaG9vZCA9IG5TZWxlY3RbbkluZGV4XS52YWx1ZTtcblxuICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmVBbmROZWlnaGJvcmhvb2QoY3Vpc2luZSwgbmVpZ2hib3Job29kLCAoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG4gICAgaWYgKGVycm9yKSB7IC8vIEdvdCBhbiBlcnJvciFcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXNldFJlc3RhdXJhbnRzKHJlc3RhdXJhbnRzKTtcbiAgICAgIGZpbGxSZXN0YXVyYW50c0hUTUwoKTtcbiAgICB9XG4gIH0pXG59O1xuXG4vKipcbiAqIENsZWFyIGN1cnJlbnQgcmVzdGF1cmFudHMsIHRoZWlyIEhUTUwgYW5kIHJlbW92ZSB0aGVpciBtYXAgbWFya2Vycy5cbiAqL1xucmVzZXRSZXN0YXVyYW50cyA9IChyZXN0YXVyYW50cykgPT4ge1xuICAvLyBSZW1vdmUgYWxsIHJlc3RhdXJhbnRzXG4gIHNlbGYucmVzdGF1cmFudHMgPSBbXTtcbiAgY29uc3QgdWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudHMtbGlzdCcpO1xuICB1bC5pbm5lckhUTUwgPSAnJztcblxuICAvLyBSZW1vdmUgYWxsIG1hcCBtYXJrZXJzXG4gIHNlbGYubWFya2Vycy5mb3JFYWNoKG0gPT4gbS5zZXRNYXAobnVsbCkpO1xuICBzZWxmLm1hcmtlcnMgPSBbXTtcbiAgc2VsZi5yZXN0YXVyYW50cyA9IHJlc3RhdXJhbnRzO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYWxsIHJlc3RhdXJhbnRzIEhUTUwgYW5kIGFkZCB0aGVtIHRvIHRoZSB3ZWJwYWdlLlxuICovXG5maWxsUmVzdGF1cmFudHNIVE1MID0gKHJlc3RhdXJhbnRzID0gc2VsZi5yZXN0YXVyYW50cykgPT4ge1xuICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50cy1saXN0Jyk7XG4gIHJlc3RhdXJhbnRzLmZvckVhY2gocmVzdGF1cmFudCA9PiB7XG4gICAgdWwuYXBwZW5kKGNyZWF0ZVJlc3RhdXJhbnRIVE1MKHJlc3RhdXJhbnQpKTtcbiAgfSk7XG4gIGFkZE1hcmtlcnNUb01hcCgpO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBIVE1MLlxuICovXG5jcmVhdGVSZXN0YXVyYW50SFRNTCA9IChyZXN0YXVyYW50KSA9PiB7XG4gIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcblxuICBjb25zdCBwaWN0dXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncGljdHVyZScpO1xuICBsaS5hcHBlbmQocGljdHVyZSk7XG5cbiAgY29uc3QgbGFyZ2VTb3VyY2VXZWJwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc291cmNlJyk7XG4gIGxhcmdlU291cmNlV2VicC5tZWRpYSA9IFwiKG1pbi13aWR0aDogNzUwcHgpXCI7XG4gIGxhcmdlU291cmNlV2VicC5zcmNzZXQgPSBEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkgKyAnLTgwMF9sYXJnZS53ZWJwJztcbiAgbGFyZ2VTb3VyY2VXZWJwLnR5cGUgPSBcImltYWdlL3dlYnBcIjtcbiAgcGljdHVyZS5hcHBlbmQobGFyZ2VTb3VyY2VXZWJwKTtcblxuICBjb25zdCBsYXJnZVNvdXJjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NvdXJjZScpO1xuICBsYXJnZVNvdXJjZS5tZWRpYSA9IFwiKG1pbi13aWR0aDogNzUwcHgpXCI7XG4gIGxhcmdlU291cmNlLnNyY3NldCA9IERCSGVscGVyLmltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSArICctODAwX2xhcmdlLmpwZyc7XG4gIGxhcmdlU291cmNlLnR5cGUgPSBcImltYWdlL2pwZWdcIjtcbiAgcGljdHVyZS5hcHBlbmQobGFyZ2VTb3VyY2UpO1xuXG4gIGNvbnN0IG1lZGl1bVNvdXJjZVdlYnAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzb3VyY2UnKTtcbiAgbWVkaXVtU291cmNlV2VicC5tZWRpYSA9IFwiKG1pbi13aWR0aDogNTAwcHgpXCI7XG4gIG1lZGl1bVNvdXJjZVdlYnAuc3Jjc2V0ID0gREJIZWxwZXIuaW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpICsgJ19tZWRpdW0ud2VicCc7XG4gIG1lZGl1bVNvdXJjZVdlYnAudHlwZSA9IFwiaW1hZ2Uvd2VicFwiO1xuICBwaWN0dXJlLmFwcGVuZChtZWRpdW1Tb3VyY2VXZWJwKTtcblxuICBjb25zdCBtZWRpdW1Tb3VyY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzb3VyY2UnKTtcbiAgbWVkaXVtU291cmNlLm1lZGlhID0gXCIobWluLXdpZHRoOiA1MDBweClcIjtcbiAgbWVkaXVtU291cmNlLnNyY3NldCA9IERCSGVscGVyLmltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSArICdfbWVkaXVtLmpwZyc7XG4gIG1lZGl1bVNvdXJjZS50eXBlID0gXCJpbWFnZS9qcGVnXCI7XG4gIHBpY3R1cmUuYXBwZW5kKG1lZGl1bVNvdXJjZSk7XG5cbiAgY29uc3Qgc291cmNlV2VicCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NvdXJjZScpO1xuICBzb3VyY2VXZWJwLnNyY3NldCA9IERCSGVscGVyLmltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSArICcud2VicCc7XG4gIHBpY3R1cmUuYXBwZW5kKHNvdXJjZVdlYnApO1xuXG4gIGNvbnN0IGltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gIGltYWdlLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50LWltZyc7XG4gIGltYWdlLnNyYyA9IERCSGVscGVyLmltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSArICcuanBnJztcbiAgaW1hZ2UuYWx0ID0gcmVzdGF1cmFudC5uYW1lICsgJyBpcyBhICcgKyByZXN0YXVyYW50LmN1aXNpbmVfdHlwZSArICcgcmVzdGF1cmFudCBpbiAnICsgcmVzdGF1cmFudC5hZGRyZXNzICsgJy4nO1xuICBwaWN0dXJlLmFwcGVuZChpbWFnZSk7XG5cbiAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XG4gIG5hbWUuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uYW1lO1xuICBsaS5hcHBlbmQobmFtZSk7XG5cbiAgY29uc3QgbmVpZ2hib3Job29kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBuZWlnaGJvcmhvb2QuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uZWlnaGJvcmhvb2Q7XG4gIGxpLmFwcGVuZChuZWlnaGJvcmhvb2QpO1xuXG4gIGNvbnN0IGFkZHJlc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGFkZHJlc3MuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5hZGRyZXNzO1xuICBsaS5hcHBlbmQoYWRkcmVzcyk7XG5cbiAgY29uc3QgbW9yZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgbW9yZS5pbm5lckhUTUwgPSAnVmlldyBEZXRhaWxzJztcbiAgbW9yZS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnYnV0dG9uJyk7XG4gIG1vcmUuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgcmVzdGF1cmFudC5uYW1lKTtcbiAgbW9yZS5ocmVmID0gREJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KTtcbiAgbGkuYXBwZW5kKG1vcmUpO1xuXG4gIHJldHVybiBsaTtcbn07XG5cbi8qKlxuICogQWRkIG1hcmtlcnMgZm9yIGN1cnJlbnQgcmVzdGF1cmFudHMgdG8gdGhlIG1hcC5cbiAqL1xuYWRkTWFya2Vyc1RvTWFwID0gKHJlc3RhdXJhbnRzID0gc2VsZi5yZXN0YXVyYW50cykgPT4ge1xuICByZXN0YXVyYW50cy5mb3JFYWNoKHJlc3RhdXJhbnQgPT4ge1xuICAgIC8vIEFkZCBtYXJrZXIgdG8gdGhlIG1hcFxuICAgIGNvbnN0IG1hcmtlciA9IERCSGVscGVyLm1hcE1hcmtlckZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgc2VsZi5tYXApO1xuICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBtYXJrZXIudXJsO1xuICAgIH0pO1xuICAgIHNlbGYubWFya2Vycy5wdXNoKG1hcmtlcik7XG4gIH0pO1xufTtcbiJdLCJmaWxlIjoibWFpbi5qcyJ9
