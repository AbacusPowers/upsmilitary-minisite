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
     */
    public function indexAction($slug)
    {
        try {
//            $this->render(
//                'VCGBundle:Page:'.$slug.'.twig',
//                array('slug' => $slug)
//            );
            $response = $this->render(
                'VCGBundle:Page:'.$slug.'.twig',
                array('slug' => $slug)
            );
        } catch (\Exception $ex) {
            // your conditional code here.
            $error = new Response(Response::HTTP_NOT_FOUND);
//            throw new \Symfony\Component\HttpKernel\Exception\HttpException(404, "Oops! Page not found");
//            var_dump($slug);
            $response = $this->render(
                'VCGBundle:Page:404.html.twig',
                array('slug' => $slug, 'error' => $error)
            );
        }
        return $response;
//        return $this->render(
//            'VCGBundle:Layouts:'.$slug.'.html.twig',
//            array('slug' => $slug)
//        );
    }
}
