<?php

namespace UPS\VCGBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Yaml\Parser;


class PhotoController extends Controller
{   
    /**
     * @Route("/photo/{slug}.html", name="homepage_photo")
     * @Route("/culture-benefits/photo/{slug}.html", name="culture_benefits_photo")
     * @Route("/culture-benefits/history/photo/{slug}.html", name="history_photo")
     * @Route("/transition-guide/photo/{slug}.html", name="transition_guide_photo")
     * @Route("/culture-benefits/faq/photo/{slug}.html", name="faq_photo")
     * @Route("/jobs/photo/{slug}.html", name="jobs_photo")
     */
    public function indexAction($slug)
    {

        $yaml = new Parser();
        
        $request = $this->container->get('request');
        $routeName = $request->get('_route');

        try {
            if($routeName === 'history_photo') {
                $photos = $yaml->parse(file_get_contents( dirname(dirname(__FILE__)). "/Resources/data/photos/history-photos.yml"));
                $parent = 'history';
            }

            $photo = $photos[$slug];
        } catch (ParseException $e) {
            printf("Unable to parse the YAML file: %s", $e->getMessage());
        }
//        try {
//            $response = $this->render(
//                'VCGBundle:Layouts:photo.html.twig',
//                array('slug' => $slug, 'photo' => $photo,'route' => $routeName, 'parent' => $parent)
//            );
//        } catch (\Exception $ex) {
//            // your conditional code here.
//            $error = new Response(Response::HTTP_NOT_FOUND);
////            throw new \Symfony\Component\HttpKernel\Exception\HttpException(404, "Oops! Page not found");
//            $response = $this->render(
//                'VCGBundle:Page:404.html.twig',
//                array('slug' => $slug, 'error' => $error)
//            );
//        }
        $response = $this->render(
            'VCGBundle:Layouts:photo.html.twig',
            array('slug' => $slug, 'photo' => $photo,'route' => $routeName, 'parent' => $parent)
        );
        return $response;
    }
}
