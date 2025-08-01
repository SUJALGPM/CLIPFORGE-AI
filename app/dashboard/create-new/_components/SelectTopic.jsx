"use client"
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";

function SelectTopic({ onUserSelect }) {
  
  const options = [
    "Custom Prompt",
    "Random AI Story",
    "Scary Story",
    "Historical Facts",
    "Bed Time Story",
    "Motivational Story",
    "Fun Facts",
  ];

  const [selectedOption, setSelectedOption] = useState();

  return (
    <div>
      <h2 className="font-bold text-2xl text-purple-700">Content</h2>
      <p className="text-gray-500">What is the topic of your video?</p>

      {/* Handle selected prompt... */}
      <Select
        onValueChange={(value) => {
          setSelectedOption(value);
          value != "Custom Prompt" && onUserSelect("topic", value);
        }}
      >
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue
            placeholder={<span className="text-black ">Content Type</span>}
          />
        </SelectTrigger>

        <SelectContent>
          {options.map((item, index) => (
            <SelectItem key={index} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Handle custom prompt... */}
      {selectedOption == "Custom Prompt" && (
        <Textarea
          className="mt-3"
          placeholder="Write prompt on which you want to generate videos"
          onChange={(e)=>onUserSelect('topic',e.target.value)}
        />
      )}

    </div>
  );
}

export default SelectTopic;
