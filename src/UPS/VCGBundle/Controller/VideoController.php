<?php

namespace UPS\VCGBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Yaml\Parser;


class VideoController extends Controller
{   
    /**
     * @Route("/video/{slug}.html", name="homepage_video")
     * @Route("/culture-benefits/video/{slug}.html", name="culture_benefits_video")
     * @Route("/transition-guide/video/{slug}.html", name="transition_guide_video")
     * @Route("/culture-benefits/faq/video/{slug}.html", name="faq_video")
     * @Route("/culture-benefits/jobs/video/{slug}.html", name="jobs_video")
     */
    public function indexAction($slug)
    {

        $yaml = new Parser();
        
        $request = $this->container->get('request');
        $routeName = $request->get('_route');

        try {
            if($routeName === 'homepage_video') {
                $videos = $yaml->parse(file_get_contents( dirname(dirname(__FILE__)). "/Resources/data/videos/career-videos.yml"));
                $parent = '/';
            } elseif ($routeName === 'jobs_video') {
                $videos = $yaml->parse(file_get_contents( dirname(dirname(__FILE__)). "/Resources/data/videos/career-videos.yml"));
                $parent = 'jobs';
            } elseif ($routeName === 'culture_benefits_video') {
                $videos = $yaml->parse(file_get_contents( dirname(dirname(__FILE__)). "/Resources/data/videos/career-videos.yml"));
                $parent = 'culture-benefits';
            } elseif ($routeName === 'transition_guide_video') {
                $videos = $yaml->parse(file_get_contents( dirname(dirname(__FILE__)). "/Resources/data/videos/transition-videos.yml"));
                $parent = 'transition-guide';
            } elseif ($routeName === 'faq_video') {
                $videos = $yaml->parse(file_get_contents( dirname(dirname(__FILE__)). "/Resources/data/videos/faq-videos.yml"));
                $parent = 'culture-benefits';
            }
            $video = $videos[$slug];
        } catch (ParseException $e) {
            printf("Unable to parse the YAML file: %s", $e->getMessage());
        }
        try {
            $response = $this->render(
                'VCGBundle:Layouts:video.html.twig',
                array('slug' => $slug, 'video' => $video,'route' => $routeName, 'parent' => $parent)
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
