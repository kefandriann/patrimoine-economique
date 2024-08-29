import React, { useState } from 'react';
import LineChart from './LineChart';
import GetValeurPatrimoine from './GetValeurPatrimoine';

function PatrimoinePage () {

  return (
    <div>
      <LineChart />
      <GetValeurPatrimoine />
    </div>
  );
}

export default PatrimoinePage;