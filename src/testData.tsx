import Button from "./components/button";
import { CardSectionData } from "./components/cardPage";

export const testData: CardSectionData[] = [
  {
    background: {
      images: ["url('https://picsum.photos/seed/first/1024/768')"],
      style: {
        backgroundSize: "cover",
      },
    },
    title: {
      content: "Lorem ipsum",
      position: "center",
    },
    scrollDownText: true,
    content: [
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
          interdum, nisl eu rhoncus ullamcorper, dolor turpis scelerisque nibh, eu
          tempor ante tellus eget nibh.`,
      <br />,
      `
          Curabitur lobortis nunc nisl, sed pharetra mi maximus in. Nullam
          malesuada, ex nec faucibus hendrerit, mi metus tincidunt nulla, ac
          ornare nisl dui ac diam.`,
    ],
  },
  {
    background: {
      images: ["url('https://picsum.photos/seed/second/1024/768')"],
      style: {
        backgroundSize: "cover",
      },
    },
    title: {
      content: "Quo Vios?",
      position: "bottomRight",
    },
    content: [
      `In pharetra lectus justo, et bibendum diam cursus et. Etiam consequat vel risus eget rhoncus. Pellentesque eget metus velit. Aliquam erat volutpat. Morbi sit amet tempus massa. Donec ac tellus eu lectus sagittis viverra in quis lectus. In non mattis sem, vel consectetur dui. Curabitur gravida et elit sit amet gravida. `,
      <br />,
      <Button>Sed bibendum. </Button>,
    ],
  },
  {
    background: {
      images: ["url('https://picsum.photos/seed/1second/1024/768')"],
      style: {
        backgroundSize: "cover",
      },
    },
    title: {
      content: "Proin augue",
      position: "bottomLeft",
    },
    content: [
      `Donec sed turpis nunc. Quisque accumsan, dolor at tempus ultrices, purus libero euismod mauris, eget porttitor nisi urna eu diam. In elementum sem ut mollis tincidunt. In eget magna auctor, consectetur massa vulputate, accumsan nunc. Mauris et malesuada enim. Ut gravida enim in enim euismod pharetra. Nunc vulputate faucibus velit non eleifend. Donec nec ante nunc. Nunc commodo erat sit amet eros dapibus congue. Maecenas cursus congue ante, sit amet scelerisque augue interdum vel. Praesent lobortis purus vitae sem lobortis fermentum. Nunc vitae sapien ornare risus semper consectetur. Nullam viverra ac sem pharetra pulvinar. `,
    ],
  },
  {
    background: {
      images: ["url('https://picsum.photos/seed/2second/1024/768')"],
      style: {
        backgroundSize: "cover",
      },
    },
    title: {
      content: "nunc condimentum",
      position: "topRight",
    },
    content: [
      `Sed placerat purus sed lacus vehicula tempus. Praesent venenatis facilisis maximus. Sed pellentesque leo sit amet eros iaculis mollis. Morbi facilisis imperdiet dictum. Praesent nec dolor varius, fermentum felis id, hendrerit sem. Donec eget urna eget risus venenatis rutrum id viverra neque. Suspendisse cursus bibendum sodales. Curabitur dictum pulvinar tellus, a pellentesque dolor varius ut. Integer bibendum facilisis neque, ut scelerisque velit auctor ut. `,
    ],
  },
  {
    background: {
      images: ["url('https://picsum.photos/seed/3second/1024/768')"],
      style: {
        backgroundSize: "cover",
      },
    },
    title: {
      content: "in mauris eu",
      position: "topLeft",
    },
    content: [
      `In mi ex, pharetra eget purus sit amet, laoreet venenatis nisl. Nunc at ex feugiat, laoreet arcu eu, mattis mi. Nulla quis consequat urna. Aenean urna metus, pretium id nunc et, egestas hendrerit quam. Suspendisse potenti. Aliquam sit amet magna nisl. Phasellus vitae volutpat urna. Curabitur semper magna vel quam vestibulum molestie. Ut egestas lacus eget ante malesuada consequat. Sed est mauris, tempor ac finibus nec, sagittis at mauris. Maecenas viverra purus eu est molestie, sit amet fringilla eros interdum. Cras id rutrum nisl. Proin fringilla id neque nec eleifend. Vestibulum at lobortis eros. Proin porta condimentum finibus. `,
    ],
  },
];
