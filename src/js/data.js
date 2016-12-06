function WaterUser() {
  this.basicConsumption = [
    0,  // 00:00 Sleep
    0,  // 01:00 Sleep
    0,  // 02:00 Sleep
    0,  // 03:00 Sleep
    0,  // 04:00 Sleep
    0,  // 05:00 Sleep
    60, // 06:00 Shower
    10, // 07:00 Breakfast
    0,  // 08:00 ?
    3,  // 09:00 Coffee
    0,  // 10:00 ?
    1,  // 11:00 Glass of water
    40, // 12:00 Lunch
    30, // 13:00 Dishes
    0,  // 14:00 ?
    10, // 15:00 Coffee/fika
    0,  // 16:00 ?
    0,  // 17:00 ?
    40, // 18:00 Dinner
    40, // 19:00 Dishes
    0,  // 20:00 ?
    0,  // 21:00 ?
    10, // 22:00 Bedtime
    0   // 23:00 Sleep
  ];

  this.lastAmount = 0;
  this.currentHour = 0;
  this.currentDay = 0;
  this.totalConsumption = 0;

  this.maxConsumption = 160;

  this.getLastHour = function() {
    var correction = Math.random() * 1.5 - 1;
    let bc = this.basicConsumption[this.currentHour];
    var amount = bc + bc * correction;
    this.totalConsumption += amount;
    this.currentHour++;
    if(this.currentHour >= 24) {
      console.log()
      this.totalConsumption = 0;
      this.currentHour = 0;
      this.currentDay++;
    }
    return amount;
  }
}

module.exports = WaterUser;
