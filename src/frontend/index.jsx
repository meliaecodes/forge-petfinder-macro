import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Box, Button,  Heading, Image, Inline, Label, LinkButton, Radio,  RadioGroup, Stack, Select, Text, Textfield, xcss } from '@forge/react';
import {view, invoke } from '@forge/bridge';

const cardStyle = xcss({
  backgroundColor: 'elevation.surface',
  margin: 'space.200',
  width: '30%',
  padding: 'space.200',
  boxShadow: 'elevation.shadow.overflow',
  borderColor: 'color.border',
  borderWidth: 'border.width',
  borderStyle: 'solid',
  borderRadius: 'border.radius',
  ':hover': {
    backgroundColor: 'elevation.surface.hovered',
    width: '35%'
  },  });

const priceStyle = xcss({
  backgroundColor: 'color.background.accent.purple.subtler',
  width: '90%',
  borderRadius: 'border.radius'
});

const backupImages = [
  { petType: 'Cat', image: 'https://i.imgur.com/mEEhf5S.png'},
  { petType: 'Dog', image: 'https://i.imgur.com/Q5g1moW.png'},
  { petType: 'Rabbit', image: 'https://i.imgur.com/D5fkSbw.png'},
  { petType: 'Small & Furry', image: 'https://i.imgur.com/5UzBVCd.png'},
  { petType: 'Horse', image: 'https://i.imgur.com/9S8NoJs.png'},
  { petType: 'Bird', image: 'https://i.imgur.com/R54wMCz.png'},
  { petType: 'Scales, Fins & Other', image: 'https://i.imgur.com/nskc5UP.png'},
  { petType: 'Barnyard', image: 'https://i.imgur.com/pxMpY2a.png'},
]

const Config = () => {

  const typeOptions = [
    { name: 'petType', value: 'all', label: 'All' },
    { name: 'petType', value: 'dog', label: 'Dog' },
    { name: 'petType', value: 'cat', label: 'Cat' },
    { name: 'petType', value: 'rabbit', label: 'Rabbit' },
    { name: 'petType', value: 'small-furry', label: 'Small & Furry' },
    { name: 'petType', value: 'horse', label: 'Horse' },
    { name: 'petType', value: 'bird', label: 'Bird' },
    { name: 'petType', value: 'scales-fins-other', label: 'Scales, Fins & Other' },
    { name: 'petType', value: 'barnyard', label: 'Barnyard' },
  ];

  const ageOptions = [
    { name: 'age', value: 'baby', label: 'Baby' },
    { name: 'age', value: 'young', label: 'Young' },
    { name: 'age', value: 'adult', label: 'Adult' },
    { name: 'age', value: 'senior', label: 'Senior' },
  ];

  const sizeOptions = [
    { name: 'size', value: 'small', label: 'Small' },
    { name: 'size', value: 'medium', label: 'Medium' },
    { name: 'size', value: 'large', label: 'Large' },
    { name: 'size', value: 'xlarge', label: 'Extra Large' },
  ];

  const genderOptions = [
    { name: 'gender', value: 'male', label: 'Male' },
    { name: 'gender', value: 'female', label: 'Female' },
  ];

  const otherOptions = [
    { name: 'other', value: 'house_trained', label: 'House Trained' },
    { name: 'other', value: 'good_with_children', label: 'Good with children' },
    { name: 'other', value: 'good_with_dogs', label: 'Good with dogs' },
    { name: 'other', value: 'good_with_cats', label: 'Good with cats' },
  ];
  
    return (
      <>
        <Label>Pet type</Label>
        <RadioGroup options={typeOptions} name="petType" value="any" />
        <Label>Zip Code</Label>
        <Textfield name="zipCode"/>
        <Label>Age</Label>
        <Select options={ageOptions} isClearable={true} isMulti={true} name="age"/>
        <Label>Size</Label>
        <Select options={sizeOptions} isClearable={true} isMulti={true} name="size"/>
        <Label>Gender</Label>
        <Select options={genderOptions} isClearable={true} isMulti={true} name="gender"/>
        <Label>Other Options</Label>
        <Select options={otherOptions} isClearable={true} isMulti={true} name="other"/>
      </>
    );
  };


const App = () => {

  const NUMCARDS = 3;
  const [animals, setAnimals] = useState(null);
  const [scroll, setScroll] = useState(0);
  const [context, setContext] = useState(undefined);

  useEffect(() => {
    invoke('getAnimals').then(setAnimals);
    view.getContext().then(setContext);
  }, []);

  useEffect(() => {
    invoke('getAnimals').then(setAnimals);
  }, [context]);

  useEffect(() => {
    console.debug("animals has changed")
    if(animals) {
    } else {
      console.debug("animals is empty")
    }
  }, [animals]);

  function refreshAnimals() {
    console.log("refreshing animals")
    invoke('getAnimals').then(setAnimals);
    setScroll(0);
  }

  function scrollRight() {
      if (animals) {
        const scrollMax = animals.animals.length - NUMCARDS;
        if (scroll < scrollMax) {
          setScroll(scroll + 1);
        } else { console.debug("scroll is at max")}
      }
  }

  function scrollLeft() {
    if (scroll > 0) {
      setScroll(scroll -1);
    }
  }


  function Card(pet) {
    return (
      <>
        <Box xcss={cardStyle}>
          <Stack alignInline="center" space="space.200" >
            <Heading as="h2">{pet.name.substring(0,13)}</Heading>
            <Box xcss={xcss({height : "150px", maxheight : "150px", minHeight: "150px", width: "150px"})}>
              <Image src={pet.primary_photo_cropped ? pet.primary_photo_cropped.large : backupImages[backupImages.map(e => e.petType).indexOf(pet.type)].image } size="xlarge" alt={pet.name + ' the ' + pet.type}></Image>
            </Box>
            <Box>
              <Stack alignInline="center" space="space.0" >
                <Box><Text>{pet.age}</Text></Box>
                <Box><Text>{pet.breeds.primary}</Text></Box>
              </Stack>
            </Box>
            <Box xcss={priceStyle}>
              <Stack alignInline="center" space="space.0">
                <Box><Text>{pet.contact.address.city}, {pet.contact.address.state}</Text></Box>
              </Stack>
            </Box>
            <Box><LinkButton href={pet.url}>Learn more</LinkButton></Box>
          </Stack>
        </Box>
      </>
    )
  }

  function CardGroup(pets) {
    return (
      <>
        <Box>
          <Inline alignInline="center">
            {pets.map(pet => (Card(pet)))}
          </Inline>
        </Box>
      </>
    )
  }


  return (
    <>
      <Heading as="h2">Available Pets</Heading>
      <Stack alignInline="center">
        <Inline alignBlock="center">
          <Button appearance="primary" onClick={() => scrollLeft()}>{"<"}</Button>
          <Box>{animals ? CardGroup(animals.animals.slice(scroll, scroll+NUMCARDS)) : "Loading..."} </Box>
          <Button appearance="primary" onClick={() => scrollRight()}>{">"}</Button>
        </Inline>
        <Button appearance="primary" onClick={() => refreshAnimals()}>Refresh</Button>
      </Stack>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ForgeReconciler.addConfig(<Config />);
