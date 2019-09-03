import moment from 'moment';

/**
 * To getSchedule, we calculate the time of arrival, departure, and travel time, while respecting
 * the order defined by the optimalPath. Dates are based on the timeOfDepartureFromOrigin which is
 * the time at which we are supposed to leave 'home'.
 * 
 * @param {object}     request        - Raw server request containing locations and departure time.
 * @param {number[][]} distanceMatrix - Distance matrix for the locations including 'home'.
 * @param {number[]}   optimalPath    - Array of location indices in optimal order.
 * 
 * @return {object} - The schedule object.
 */
function getSchedule(request, distanceMatrix, optimalPath) {
  let totalTime = moment.duration();
  let schedule = [];

  let departureTime = moment.unix(request.departureTime);
  const locations = [
    request.home,
    ...request.tasks,
  ];

  for (let i = 0 ; i < optimalPath.length - 1 ; i += 1) {
    const originIndex = optimalPath[i];
    const destinationIndex = optimalPath[i + 1];

    const destination = locations[destinationIndex];
    const travelTime = moment.duration(distanceMatrix[originIndex][destinationIndex], 's');

    totalTime.add(travelTime);

    if (destinationIndex !== 0) { // Ignore if it's the trip back 'home'.
      const taskDuration = moment.duration(destination.duration, 'm');

      totalTime.add(taskDuration);

      const timeOfArrivalAtDestination = departureTime.clone().add(travelTime);
      const timeOfDepartureFromDestination = timeOfArrivalAtDestination.clone().add(taskDuration);

      // Set time of derparture for next task.
      departureTime = timeOfDepartureFromDestination.clone();

      schedule.push({
        id: destination.id,
        startsAt: timeOfArrivalAtDestination.unix(),
        endsAt: timeOfDepartureFromDestination.unix(),
        lat: destination.lat,
        lng: destination.lng,
      });
    }
  }

  return {
    totalTime: Math.round(totalTime.asMinutes()),
    schedule,
  };
}

export {
  getSchedule,
}