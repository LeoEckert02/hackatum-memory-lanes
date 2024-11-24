import { calculateAge } from "@/lib/utils";
import { Card, CardContent } from "./card";
import AudioPlayer from "./audioplayer";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer";
import { Button } from "./button";
import { Input } from "./input";
import { toast } from "sonner";

const url = 'https://memory-lanes.pockethost.io/';

export default function PersonProfile({ personData }) {
    const age = calculateAge(personData.dob);

    return (
        <div className="bg-white pt-6 sm:px-6 lg:px-8">
            <Card className="max-w-2xl mx-auto border-none shadow-none border-black">
                <CardContent className="space-y-8">
                    <div className="border-2 border-slate-900 p-7 -mb-5 rounded-xl ">
                        <div className="space-y-4 text-left">
                            <h1 className="text-[2.5rem] font-bold text-slate-900">
                                {personData.firstname}, {age}
                            </h1>
                            <h2 className="!mt-1 text-slate-500">
                                {personData.landmark}
                            </h2>
                            {/* Divider */}
                            <hr className="my-6 border-t-2 border-slate-200" />
                            <p className="text-xl leading-relaxed text-slate-900 mt-12">
                                {personData.description}
                            </p>
                        </div>
                    </div>
                    <div className="-pt-5">
                    <AudioPlayer 
                        audioSrc={personData.audioUrl} 
                        germanSRTUrl={personData.germanSRTUrl} 
                        englishSRTUrl={personData.englishSRTUrl} 
                    />
                    </div>
                </CardContent>
            </Card>

            {/* Drawer and Button */}
            <div className="-mt-3 w-full px-[23px]"> {/* Small margin above the button */}
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button className='w-full mb-4'>Join a Meetup!</Button>
                    </DrawerTrigger>            
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle className="text-2xl">Join a Meetup!</DrawerTitle>
                        </DrawerHeader>
                        <div className="my-6 px-6 pt-4 mt-0">
                            <p className="text-left text-lg">
                                Enter your email and click <strong>Submit</strong> to express your interest in a meetup.
                                Once enough people show interest, our volunteers will organize and notify you about the event.
                            </p>
                        </div>
                        <DrawerFooter>
                            <Input type="email" placeholder="Enter your Email..." className="mb-3" />
                            <DrawerClose asChild>
                                <Button onClick={() =>
                                    toast("Email submitted succesfully!", {
                                    })
                                }>Submit</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    );
}
