
export function PartnerVideo() {
    // A generic, high-quality placeholder video. Replace the src with your own video embed link.
    const videoSrc = "https://www.youtube.com/embed/LXb3EKWsInQ";

    return (
        <section id="partner-video" className="py-20 sm:py-24 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                        See It in Action
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                        Watch a brief overview of how Wisdomis Fun transforms the learning experience for students and empowers educators.
                    </p>
                </div>

                <div className="mt-16">
                    <div className="relative aspect-video max-w-4xl mx-auto">
                        <iframe 
                            className="absolute top-0 left-0 w-full h-full rounded-2xl border-4 border-primary/20 shadow-2xl shadow-primary/20" 
                            src={videoSrc}
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}
