<?php

namespace UPS\VCGBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;

class PageController extends Controller
{
    /**
     * @Route("/{slug}")
     * @Route("/{slug}.html", name="page")
     * @Route("/transition-guide/{slug}.html", name="transition_guide_page")
     * @Route("/culture-benefits/{slug}.html", name="culture_benefits_page")
     * @Route("/career-explorer/{slug}.html", name="career_explorer_page")
     */
    public function indexAction($slug)
    {
        if(substr($slug, -5, 5) === '.html') {
            $slug = substr($slug, 0, -5);
        }
        $response = $this->render(
                'VCGBundle:Page:'.$slug.'.html.twig',
                array('slug' => $slug)
            );
//        try {
//
//            $response = $this->render(
//                'VCGBundle:Page:'.$slug.'.html.twig',
//                array('slug' => $slug)
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
        return $response;

    }
}
