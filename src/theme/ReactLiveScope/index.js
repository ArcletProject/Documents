import React from 'react';

import { Command, Args, Option, Subcommand } from "@arcletjs/alconna";
import { Pattern, MatchMode } from "@arcletjs/nepattern";
// Add react-live imports you need here
const ReactLiveScope = {
  React,
  Command, Args, Option, Subcommand,
  Pattern, MatchMode,
  ...React,
};
export default ReactLiveScope;
