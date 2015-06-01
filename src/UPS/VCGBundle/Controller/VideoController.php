<?php

namespace UPS\VCGBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Yaml\Parser;


class VideoController extends Controller
{   
    /**
     * @Route("/video/{slug}.html")
     * @Route("/culture-benefits/video/{slug}.html", name="culture_benefits_video")
     * @Route("/transition-guide/video/{slug}.html", name="transition_guide_video")
     */
    public function indexAction($slug)
    {

        $yaml = new Parser();
        
        $request = $this->container->get('request');
        $routeName = $request->get('_route');
        try {
            $videos = $yaml->parse(file_get_contents( dirname(dirname(__FILE__)). "/Resources/data/videos.yml"));
            $video = $videos[$slug];
        } catch (ParseException $e) {
            printf("Unable to parse the YAML file: %s", $e->getMessage());
        }
        try {
            $response = $this->render(
                'VCGBundle:Layouts:video.html.twig',
                array('slug' => $slug, 'video' => $video,'route' => $routeName)
            );
        } catch (\Exception $ex) {
            // your conditional code here.
            $error = new Response(Response::HTTP_NOT_FOUND);
//            throw new \Symfony\Component\HttpKernel\Exception\HttpException(404, "Oops! Page not found");
            $response = $this->render(
                'VCGBundle:Page:404.html.twig',
                array('slug' => $slug, 'error' => $error)
            );
        }
        return $response;
    }
}
